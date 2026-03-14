import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../../services/offline_queue.dart';

// ── US.M2: GPS Clock-In + Active Shift Timer + Offline Queue ──────────────────
// M2-S08: Caregiver clocks in with GPS capture. Timer runs until clock-out.
// Offline: records are queued locally and synced when connectivity resumes.
// ─────────────────────────────────────────────────────────────────────────────

enum ShiftStatus { idle, active, ended }

class ShiftsScreen extends StatefulWidget {
  const ShiftsScreen({super.key});

  @override
  State<ShiftsScreen> createState() => _ShiftsScreenState();
}

class _ShiftsScreenState extends State<ShiftsScreen> {
  ShiftStatus _status    = ShiftStatus.idle;
  Position?   _clockInGps;
  DateTime?   _clockInTime;
  DateTime?   _clockOutTime;
  Duration    _elapsed   = Duration.zero;
  Timer?      _timer;
  bool        _locating  = false;
  String?     _error;

  // Offline queue state
  bool        _isOnline       = true;
  int         _queuedCount    = 0;
  bool        _syncing        = false;
  String?     _syncMessage;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;

  static const _dark  = Color(0xFF1A1A2E);
  static const _green = Color(0xFF4ADE80);
  static const _muted = Color(0xFF4A4A6A);
  static const _bg    = Color(0xFFFAF9F7);

  // Sample upcoming shifts (replaced by Firestore data once C1 agent is live)
  final List<Map<String, String>> _upcomingShifts = [
    {'client': 'Margaret T.',  'time': '09:00 – 11:00', 'zone': 'Zone 2', 'type': 'Personal Care'},
    {'client': 'Robert M.',    'time': '13:30 – 15:30', 'zone': 'Zone 3', 'type': 'Community Access'},
    {'client': 'Patricia K.',  'time': '16:00 – 18:00', 'zone': 'Zone 1', 'type': 'Domestic Assist'},
  ];

  @override
  void initState() {
    super.initState();
    _initConnectivity();
    _refreshQueueCount();
  }

  Future<void> _initConnectivity() async {
    final results = await Connectivity().checkConnectivity();
    _updateConnectivity(results);

    _connectivitySub = Connectivity().onConnectivityChanged.listen((results) {
      final wasOffline = !_isOnline;
      _updateConnectivity(results);
      if (wasOffline && _isOnline) {
        _trySyncQueue(); // auto-sync when connection restored
      }
    });
  }

  void _updateConnectivity(List<ConnectivityResult> results) {
    setState(() {
      _isOnline = results.any((r) => r != ConnectivityResult.none);
    });
  }

  Future<void> _refreshQueueCount() async {
    final count = await OfflineQueue.count();
    if (mounted) setState(() => _queuedCount = count);
  }

  Future<void> _trySyncQueue() async {
    if (_syncing || _queuedCount == 0) return;
    setState(() { _syncing = true; _syncMessage = null; });

    final result = await OfflineQueue.flush();

    await _refreshQueueCount();
    setState(() {
      _syncing     = false;
      _syncMessage = result.summary;
    });
    Future.delayed(const Duration(seconds: 5), () {
      if (mounted) setState(() => _syncMessage = null);
    });
  }

  Future<void> _clockIn() async {
    setState(() { _locating = true; _error = null; });
    try {
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        await Geolocator.requestPermission();
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        setState(() => _elapsed = DateTime.now().difference(_clockInTime!));
      });
      setState(() {
        _clockInGps  = pos;
        _clockInTime = DateTime.now();
        _status      = ShiftStatus.active;
        _locating    = false;
      });

      // Queue clock-in record (online: will sync immediately; offline: queued)
      final record = OfflineShiftRecord(
        type:      'clock_in',
        shiftId:   'shift_${DateTime.now().millisecondsSinceEpoch}',
        lat:       pos.latitude,
        lng:       pos.longitude,
        timestamp: DateTime.now().toIso8601String(),
      );
      if (_isOnline) {
        // TODO: POST directly to data-connector /shifts/clock-in
        await Future.delayed(const Duration(milliseconds: 100)); // stub
      } else {
        await OfflineQueue.enqueue(record);
        await _refreshQueueCount();
      }
    } catch (e) {
      setState(() {
        _error    = 'Could not get location. Check permissions and try again.';
        _locating = false;
      });
    }
  }

  void _clockOut() {
    _timer?.cancel();
    final clockOutTime = DateTime.now();
    setState(() {
      _clockOutTime = clockOutTime;
      _status       = ShiftStatus.ended;
    });

    // Queue clock-out record
    final record = OfflineShiftRecord(
      type:      'clock_out',
      shiftId:   'shift_active',
      timestamp: clockOutTime.toIso8601String(),
    );
    if (_isOnline) {
      // TODO: POST directly to data-connector /shifts/clock-out
    } else {
      OfflineQueue.enqueue(record).then((_) => _refreshQueueCount());
    }
  }

  void _resetShift() {
    setState(() {
      _status      = ShiftStatus.idle;
      _clockInGps  = null;
      _clockInTime = null;
      _clockOutTime= null;
      _elapsed     = Duration.zero;
      _error       = null;
    });
  }

  String _formatDuration(Duration d) {
    final h = d.inHours.toString().padLeft(2, '0');
    final m = (d.inMinutes % 60).toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$h:$m:$s';
  }

  @override
  void dispose() {
    _timer?.cancel();
    _connectivitySub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _dark,
        elevation: 0,
        title: const Text('HANSONIUM', style: TextStyle(color: Colors.white, letterSpacing: 3, fontSize: 14, fontWeight: FontWeight.w700)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ── Connectivity / Offline Banner ───────────────────────
            if (!_isOnline)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF9C3),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFDE047)),
                ),
                child: Row(children: [
                  const Icon(Icons.wifi_off_rounded, color: Color(0xFFB45309), size: 18),
                  const SizedBox(width: 8),
                  Expanded(child: Text(
                    'You\'re offline. Shift records are queued locally and will sync when connection is restored.',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF92400E)),
                  )),
                ]),
              ),

            if (_isOnline && _queuedCount > 0)
              GestureDetector(
                onTap: _trySyncQueue,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF93C5FD)),
                  ),
                  child: Row(children: [
                    _syncing
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1D4ED8)))
                        : const Icon(Icons.cloud_upload_outlined, color: Color(0xFF1D4ED8), size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(
                      _syncing
                          ? 'Syncing $_queuedCount queued record${_queuedCount > 1 ? "s" : ""}…'
                          : 'Tap to sync $_queuedCount offline record${_queuedCount > 1 ? "s" : ""}',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF1D4ED8), fontWeight: FontWeight.w500),
                    )),
                  ]),
                ),
              ),

            if (_syncMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF86EFAC)),
                ),
                child: Text(_syncMessage!, style: const TextStyle(fontSize: 12, color: Color(0xFF16A34A))),
              ),

            // ── Clock-In Card ───────────────────────────────────────
            _card(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Today\'s Shift', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _muted, letterSpacing: 1)),
                  const SizedBox(height: 4),
                  Text(DateFormat('EEEE, d MMMM yyyy').format(DateTime.now()),
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: _dark)),
                  const SizedBox(height: 20),

                  // Timer display
                  if (_status == ShiftStatus.active) ...[
                    Center(
                      child: Text(_formatDuration(_elapsed),
                          style: TextStyle(fontSize: 48, fontWeight: FontWeight.w700, color: _dark,
                              fontFeatures: const [FontFeature.tabularFigures()])),
                    ),
                    const SizedBox(height: 4),
                    Center(child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Container(width: 8, height: 8, decoration: BoxDecoration(color: _green, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text('Shift active', style: TextStyle(fontSize: 13, color: _muted)),
                    ])),
                    const SizedBox(height: 8),
                    if (_clockInGps != null)
                      Center(child: Text(
                        '📍 ${_clockInGps!.latitude.toStringAsFixed(5)}, ${_clockInGps!.longitude.toStringAsFixed(5)}',
                        style: TextStyle(fontSize: 11, color: _muted),
                      )),
                    const SizedBox(height: 20),
                  ],

                  if (_status == ShiftStatus.ended) ...[
                    Center(child: Column(children: [
                      Icon(Icons.check_circle_outline_rounded, color: _green, size: 48),
                      const SizedBox(height: 8),
                      Text('Shift Complete', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: _dark)),
                      const SizedBox(height: 4),
                      Text('Duration: ${_formatDuration(_elapsed)}',
                          style: TextStyle(fontSize: 14, color: _muted)),
                    ])),
                    const SizedBox(height: 20),
                  ],

                  // Error
                  if (_error != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFFECACA)),
                      ),
                      child: Text(_error!, style: const TextStyle(fontSize: 13, color: Color(0xFFDC2626))),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Action button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: _status == ShiftStatus.idle
                        ? ElevatedButton.icon(
                            onPressed: _locating ? null : _clockIn,
                            icon: _locating
                                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Icon(Icons.login_rounded, size: 20),
                            label: Text(_locating ? 'Getting location…' : 'Clock In', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _dark, foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              elevation: 0,
                            ),
                          )
                        : _status == ShiftStatus.active
                            ? ElevatedButton.icon(
                                onPressed: _clockOut,
                                icon: const Icon(Icons.logout_rounded, size: 20),
                                label: const Text('Clock Out', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFDC2626), foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                  elevation: 0,
                                ),
                              )
                            : OutlinedButton.icon(
                                onPressed: _resetShift,
                                icon: const Icon(Icons.refresh_rounded, size: 20),
                                label: const Text('New Shift', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: _dark,
                                  side: BorderSide(color: _dark.withAlpha(51)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // ── Upcoming Shifts ─────────────────────────────────────
            Text('Upcoming Shifts', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: _dark)),
            const SizedBox(height: 12),
            ..._upcomingShifts.map((shift) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _card(
                child: Row(children: [
                  Container(width: 3, height: 48, decoration: BoxDecoration(color: _green, borderRadius: BorderRadius.circular(2))),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(shift['client']!, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: _dark)),
                    const SizedBox(height: 2),
                    Text('${shift['time']} · ${shift['zone']}', style: TextStyle(fontSize: 12, color: _muted)),
                    Text(shift['type']!, style: TextStyle(fontSize: 11, color: _muted)),
                  ])),
                  Icon(Icons.chevron_right_rounded, color: _muted),
                ]),
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _card({required Widget child}) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFE8E4DD)),
    ),
    child: child,
  );
}
