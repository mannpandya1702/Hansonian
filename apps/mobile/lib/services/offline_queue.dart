import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

// ── M2-S08: Offline Queue Service ─────────────────────────────────────────────
// Buffers shift clock-in/out records when device is offline.
// On reconnect, queued records are flushed to the data-connector.
// TODO: Replace _flush() stub with real POST to data-connector /shifts/sync
// ──────────────────────────────────────────────────────────────────────────────

const _kQueueKey = 'hs_offline_shift_queue';

class OfflineShiftRecord {
  final String  type;       // 'clock_in' | 'clock_out'
  final String  shiftId;
  final double? lat;
  final double? lng;
  final String  timestamp;

  const OfflineShiftRecord({
    required this.type,
    required this.shiftId,
    this.lat,
    this.lng,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'type':      type,
    'shiftId':   shiftId,
    'lat':       lat,
    'lng':       lng,
    'timestamp': timestamp,
  };

  factory OfflineShiftRecord.fromJson(Map<String, dynamic> j) =>
      OfflineShiftRecord(
        type:      j['type']      as String,
        shiftId:   j['shiftId']   as String,
        lat:       j['lat']       as double?,
        lng:       j['lng']       as double?,
        timestamp: j['timestamp'] as String,
      );
}

class OfflineQueue {
  // Enqueue a record for later sync
  static Future<void> enqueue(OfflineShiftRecord record) async {
    final prefs = await SharedPreferences.getInstance();
    final raw   = prefs.getStringList(_kQueueKey) ?? [];
    raw.add(jsonEncode(record.toJson()));
    await prefs.setStringList(_kQueueKey, raw);
  }

  // Returns all pending records
  static Future<List<OfflineShiftRecord>> getQueue() async {
    final prefs = await SharedPreferences.getInstance();
    final raw   = prefs.getStringList(_kQueueKey) ?? [];
    return raw
        .map((e) => OfflineShiftRecord.fromJson(jsonDecode(e) as Map<String, dynamic>))
        .toList();
  }

  // Returns count of queued records
  static Future<int> count() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_kQueueKey) ?? []).length;
  }

  // Flush queued records to backend, then clear
  // Called when connectivity is restored.
  static Future<SyncResult> flush() async {
    final queue = await getQueue();
    if (queue.isEmpty) return SyncResult(synced: 0, failed: 0);

    int synced = 0;
    int failed = 0;

    for (final record in queue) {
      try {
        // TODO: Replace with real HTTP POST to data-connector
        // final response = await http.post(
        //   Uri.parse('$DATA_CONNECTOR_URL/shifts/sync'),
        //   headers: {'Content-Type': 'application/json'},
        //   body: jsonEncode(record.toJson()),
        // );
        // if (response.statusCode == 200 || response.statusCode == 201) synced++; else failed++;

        // Stub: simulate successful sync
        await Future.delayed(const Duration(milliseconds: 100));
        synced++;
      } catch (_) {
        failed++;
      }
    }

    if (failed == 0) {
      // All synced — clear queue
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_kQueueKey);
    }

    return SyncResult(synced: synced, failed: failed);
  }

  // Clear queue (e.g. on sign-out)
  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kQueueKey);
  }
}

class SyncResult {
  final int synced;
  final int failed;
  const SyncResult({required this.synced, required this.failed});

  bool get hasErrors => failed > 0;
  String get summary => hasErrors
      ? '$synced synced, $failed failed — will retry on next connection.'
      : '$synced record${synced != 1 ? "s" : ""} synced successfully.';
}
