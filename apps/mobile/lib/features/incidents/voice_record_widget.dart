import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';

// ── M3-S13: Voice Recording Widget ───────────────────────────────────────────
// Caregiver can record a voice incident report.
// After recording, a mock transcript preview is shown.
// TODO: POST audio file + transcript to data-connector /incidents/voice once live.
// ─────────────────────────────────────────────────────────────────────────────

class VoiceRecordWidget extends StatefulWidget {
  final void Function(File audioFile, String transcript)? onRecordingComplete;

  const VoiceRecordWidget({super.key, this.onRecordingComplete});

  @override
  State<VoiceRecordWidget> createState() => _VoiceRecordWidgetState();
}

class _VoiceRecordWidgetState extends State<VoiceRecordWidget> {
  final AudioRecorder _recorder = AudioRecorder();

  bool      _isRecording   = false;
  bool      _hasRecording  = false;
  bool      _showTranscript = false;
  Duration  _elapsed        = Duration.zero;
  Timer?    _timer;
  String?   _filePath;

  // Mock transcript — replaced by Whisper / speech-to-text once backend is live
  String _transcript = '';

  static const _dark   = Color(0xFF1A1A2E);
  static const _green  = Color(0xFF4ADE80);
  static const _muted  = Color(0xFF4A4A6A);
  static const _red    = Color(0xFFDC2626);

  Future<void> _startRecording() async {
    final hasPermission = await _recorder.hasPermission();
    if (!hasPermission) {
      _showError('Microphone permission denied.');
      return;
    }

    final dir      = await getTemporaryDirectory();
    final path     = '${dir.path}/incident_voice_${DateTime.now().millisecondsSinceEpoch}.m4a';
    _filePath      = path;

    await _recorder.start(const RecordConfig(encoder: AudioEncoder.aacLc), path: path);

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _elapsed = _elapsed + const Duration(seconds: 1));
    });

    setState(() {
      _isRecording  = true;
      _hasRecording = false;
      _elapsed      = Duration.zero;
      _transcript   = '';
      _showTranscript = false;
    });
  }

  Future<void> _stopRecording() async {
    _timer?.cancel();
    await _recorder.stop();

    // Mock transcript preview — real transcription via Whisper API on backend
    final mockTranscript = 'Client reported feeling unwell during morning routine. '
        'Observed minor bruising on left forearm — no apparent fall. '
        'Client stated they bumped into the door frame. '
        'Administered first aid and contacted supervisor at ${_formatTime(_elapsed)} into shift.';

    setState(() {
      _isRecording    = false;
      _hasRecording   = true;
      _transcript     = mockTranscript;
      _showTranscript = true;
    });

    if (_filePath != null && widget.onRecordingComplete != null) {
      widget.onRecordingComplete!(File(_filePath!), _transcript);
    }
  }

  void _discardRecording() {
    _timer?.cancel();
    if (_isRecording) _recorder.stop();
    setState(() {
      _isRecording    = false;
      _hasRecording   = false;
      _transcript     = '';
      _elapsed        = Duration.zero;
      _showTranscript = false;
      _filePath       = null;
    });
  }

  void _showError(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: _red),
    );
  }

  String _formatTime(Duration d) {
    final m = d.inMinutes.toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  void dispose() {
    _timer?.cancel();
    _recorder.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Recording controls ──────────────────────────────────────────────
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE8E4DD)),
          ),
          child: Column(
            children: [
              // Waveform visual
              Container(
                height: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0EDE6),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: _isRecording
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(16, (i) {
                          return AnimatedContainer(
                            duration: Duration(milliseconds: 300 + i * 40),
                            width: 3,
                            height: 8.0 + (i % 4) * 10.0,
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            decoration: BoxDecoration(
                              color: _green,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          );
                        }),
                      )
                    : Center(
                        child: Text(
                          _hasRecording ? '✓ Recording saved' : 'Tap below to start recording',
                          style: TextStyle(fontSize: 13, color: _muted),
                        ),
                      ),
              ),

              const SizedBox(height: 16),

              // Timer
              if (_isRecording || _hasRecording)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_isRecording) ...[
                        Container(
                          width: 8, height: 8,
                          decoration: const BoxDecoration(color: _red, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 6),
                      ],
                      Text(
                        _formatTime(_elapsed),
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: _isRecording ? _red : _dark,
                        ),
                      ),
                    ],
                  ),
                ),

              // Record / Stop button
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (!_isRecording && !_hasRecording)
                    _actionButton(
                      onTap: _startRecording,
                      icon: Icons.mic_rounded,
                      label: 'Start Recording',
                      color: _dark,
                    ),
                  if (_isRecording)
                    _actionButton(
                      onTap: _stopRecording,
                      icon: Icons.stop_rounded,
                      label: 'Stop Recording',
                      color: _red,
                    ),
                  if (_hasRecording) ...[
                    _actionButton(
                      onTap: _startRecording,
                      icon: Icons.refresh_rounded,
                      label: 'Re-record',
                      color: _muted,
                      outlined: true,
                    ),
                    const SizedBox(width: 10),
                    _actionButton(
                      onTap: _discardRecording,
                      icon: Icons.delete_outline_rounded,
                      label: 'Discard',
                      color: _red,
                      outlined: true,
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),

        // ── Transcript preview ──────────────────────────────────────────────
        if (_showTranscript && _transcript.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF86EFAC)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.text_snippet_outlined, color: Color(0xFF16A34A), size: 16),
                    const SizedBox(width: 6),
                    Text(
                      'Auto-Transcript Preview',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      'AI-generated — review before submitting',
                      style: TextStyle(fontSize: 10, color: _muted),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  _transcript,
                  style: const TextStyle(fontSize: 13, color: Color(0xFF1A1A2E), height: 1.5),
                ),
                const SizedBox(height: 10),
                Text(
                  'TODO: Real transcription via POST to data-connector /incidents/transcribe',
                  style: TextStyle(fontSize: 10, color: _muted, fontStyle: FontStyle.italic),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _actionButton({
    required VoidCallback onTap,
    required IconData icon,
    required String label,
    required Color color,
    bool outlined = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: outlined ? Colors.white : color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: outlined ? color : color),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: outlined ? color : Colors.white, size: 18),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: outlined ? color : Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
