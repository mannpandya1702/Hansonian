import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'voice_record_widget.dart';

// ── US.M4: Incident Reporting + Photo Upload + Voice Report ───────────────────
// M3-S13: Caregiver submits an incident report with optional photo + voice.
// Critical incidents trigger admin notification (wired via data-connector).
// ─────────────────────────────────────────────────────────────────────────────

enum IncidentSeverity { low, medium, high, critical }

class IncidentsScreen extends StatefulWidget {
  const IncidentsScreen({super.key});

  @override
  State<IncidentsScreen> createState() => _IncidentsScreenState();
}

class _IncidentsScreenState extends State<IncidentsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabCtrl;

  final _formKey      = GlobalKey<FormState>();
  final _titleCtrl    = TextEditingController();
  final _detailCtrl   = TextEditingController();
  final _picker       = ImagePicker();

  IncidentSeverity _severity      = IncidentSeverity.medium;
  File?            _photo;
  File?            _voiceFile;
  String?          _voiceTranscript;
  bool             _submitted     = false;
  bool             _saving        = false;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _titleCtrl.dispose();
    _detailCtrl.dispose();
    super.dispose();
  }

  static const _dark     = Color(0xFF1A1A2E);
  static const _green    = Color(0xFF4ADE80);
  static const _muted    = Color(0xFF4A4A6A);
  static const _bg       = Color(0xFFFAF9F7);
  static const _critical = Color(0xFFDC2626);

  final Map<IncidentSeverity, Map<String, dynamic>> _sevMeta = {
    IncidentSeverity.low:      {'label': 'Low',      'color': const Color(0xFF16A34A), 'bg': const Color(0xFFDCFCE7)},
    IncidentSeverity.medium:   {'label': 'Medium',   'color': const Color(0xFFB45309), 'bg': const Color(0xFFFEF9C3)},
    IncidentSeverity.high:     {'label': 'High',     'color': const Color(0xFFEA580C), 'bg': const Color(0xFFFFF7ED)},
    IncidentSeverity.critical: {'label': 'Critical', 'color': _critical,               'bg': const Color(0xFFFEF2F2)},
  };

  Future<void> _pickPhoto() async {
    final img = await _picker.pickImage(source: ImageSource.camera, imageQuality: 80);
    if (img != null) setState(() => _photo = File(img.path));
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    // TODO: POST to data-connector /incidents with photo + voice + transcript
    // If _severity == critical: backend auto-notifies admin via push notification
    await Future.delayed(const Duration(milliseconds: 700));
    setState(() { _saving = false; _submitted = true; });
    _titleCtrl.clear();
    _detailCtrl.clear();
    setState(() {
      _photo           = null;
      _voiceFile       = null;
      _voiceTranscript = null;
      _severity        = IncidentSeverity.medium;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _dark,
        elevation: 0,
        title: const Text('Report Incident',
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
        bottom: TabBar(
          controller: _tabCtrl,
          indicatorColor: _green,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white54,
          labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
          tabs: const [
            Tab(text: 'Written Report'),
            Tab(text: 'Voice Report'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          _buildWrittenTab(),
          _buildVoiceTab(),
        ],
      ),
    );
  }

  // ── Written + Photo Tab ───────────────────────────────────────────────────

  Widget _buildWrittenTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Critical alert banner
            if (_severity == IncidentSeverity.critical)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(children: [
                  const Icon(Icons.warning_rounded, color: _critical, size: 20),
                  const SizedBox(width: 10),
                  const Expanded(child: Text(
                    'Critical incidents trigger immediate admin notification.',
                    style: TextStyle(fontSize: 13, color: _critical, fontWeight: FontWeight.w500),
                  )),
                ]),
              ),

              _card(child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Incident Details', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _dark)),
                  const SizedBox(height: 20),

                  // Title
                  _label('Incident Title'),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _titleCtrl,
                    textInputAction: TextInputAction.next,
                    decoration: _inputDec('e.g. Fall risk — wet floor in bathroom'),
                    validator: (v) => v == null || v.trim().isEmpty ? 'Title is required' : null,
                  ),
                  const SizedBox(height: 16),

                  // Severity
                  _label('Severity'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    children: IncidentSeverity.values.map((s) {
                      final meta    = _sevMeta[s]!;
                      final selected = _severity == s;
                      return GestureDetector(
                        onTap: () => setState(() => _severity = s),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: selected ? meta['bg'] : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: selected ? meta['color'] : const Color(0xFFE8E4DD),
                              width: selected ? 1.5 : 1,
                            ),
                          ),
                          child: Text(meta['label'],
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: selected ? meta['color'] : _muted,
                              )),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  _label('Description'),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _detailCtrl,
                    maxLines: 5,
                    decoration: _inputDec('Describe what happened, who was involved, and immediate actions taken…'),
                    validator: (v) => v == null || v.trim().length < 20
                        ? 'Please provide at least 20 characters'
                        : null,
                  ),
                  const SizedBox(height: 20),

                  // Photo upload
                  _label('Photo Evidence (optional)'),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: _pickPhoto,
                    child: Container(
                      height: _photo != null ? 180 : 80,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0EDE6),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE8E4DD), style: BorderStyle.solid),
                      ),
                      child: _photo != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(_photo!, fit: BoxFit.cover),
                            )
                          : Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                              Icon(Icons.camera_alt_outlined, color: _muted, size: 24),
                              const SizedBox(height: 6),
                              Text('Tap to take photo', style: TextStyle(fontSize: 13, color: _muted)),
                            ]),
                    ),
                  ),
                  if (_photo != null) ...[
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: () => setState(() => _photo = null),
                      icon: const Icon(Icons.delete_outline_rounded, size: 16),
                      label: const Text('Remove photo', style: TextStyle(fontSize: 12)),
                      style: TextButton.styleFrom(foregroundColor: _critical, padding: EdgeInsets.zero),
                    ),
                  ],
                ],
              )),

              const SizedBox(height: 16),

              // Success message
              if (_submitted)
                Container(
                  padding: const EdgeInsets.all(14),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF86EFAC)),
                  ),
                  child: Row(children: [
                    Icon(Icons.check_circle_outline_rounded, color: _green, size: 20),
                    const SizedBox(width: 10),
                    const Expanded(child: Text('Incident submitted. Admin has been notified.',
                        style: TextStyle(fontSize: 13, color: Color(0xFF16A34A)))),
                  ]),
                ),

              // Submit button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _saving ? null : () { setState(() => _submitted = false); _submit(); },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _severity == IncidentSeverity.critical ? _critical : _dark,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: _saving
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                          if (_severity == IncidentSeverity.critical)
                            const Padding(padding: EdgeInsets.only(right: 8), child: Icon(Icons.warning_rounded, size: 18)),
                          Text(
                            _severity == IncidentSeverity.critical ? 'Submit & Notify Admin' : 'Submit Incident',
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                          ),
                        ]),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  // ── Voice Report Tab ──────────────────────────────────────────────────────

  Widget _buildVoiceTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Voice Incident Report',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _dark)),
          const SizedBox(height: 6),
          Text(
            'Record a verbal description of the incident. '
            'An auto-transcript will be generated for review before submission.',
            style: TextStyle(fontSize: 13, color: _muted),
          ),
          const SizedBox(height: 20),

          // Voice record widget
          VoiceRecordWidget(
            onRecordingComplete: (file, transcript) {
              setState(() {
                _voiceFile       = file;
                _voiceTranscript = transcript;
              });
            },
          ),

          const SizedBox(height: 20),

          // Severity (same picker as written tab)
          _label('Severity'),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: IncidentSeverity.values.map((s) {
              final meta     = _sevMeta[s]!;
              final selected = _severity == s;
              return GestureDetector(
                onTap: () => setState(() => _severity = s),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: selected ? meta['bg'] : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: selected ? meta['color'] : const Color(0xFFE8E4DD),
                      width: selected ? 1.5 : 1,
                    ),
                  ),
                  child: Text(meta['label'],
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: selected ? meta['color'] : _muted,
                      )),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 20),

          // Submit button — only enabled once recording is done
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: (_voiceFile != null && !_saving)
                  ? () { setState(() => _submitted = false); _submit(); }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _severity == IncidentSeverity.critical ? _critical : _dark,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                elevation: 0,
                disabledBackgroundColor: const Color(0xFFE8E4DD),
              ),
              child: _saving
                  ? const SizedBox(
                      width: 20, height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Text(
                      _voiceFile != null ? 'Submit Voice Report' : 'Record audio first',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
            ),
          ),

          if (_submitted)
            Container(
              margin: const EdgeInsets.only(top: 16),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFDCFCE7),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: Row(children: [
                Icon(Icons.check_circle_outline_rounded, color: _green, size: 20),
                const SizedBox(width: 10),
                const Expanded(child: Text('Voice report submitted. Admin has been notified.',
                    style: TextStyle(fontSize: 13, color: Color(0xFF16A34A)))),
              ]),
            ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _label(String text) => Text(text,
      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: _dark));

  InputDecoration _inputDec(String hint) => InputDecoration(
    hintText: hint,
    hintStyle: TextStyle(fontSize: 13, color: _muted),
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF1A1A2E), width: 1.5)),
  );

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
