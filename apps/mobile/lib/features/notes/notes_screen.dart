import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// ── US.M3: Session Notes ──────────────────────────────────────────────────────
// Caregiver writes session progress notes after each shift.
// Notes are linked to participant + shift ID and stored via data-connector.
// ─────────────────────────────────────────────────────────────────────────────

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  final _formKey   = GlobalKey<FormState>();
  final _noteCtrl  = TextEditingController();

  String  _selectedGoal    = 'Daily Living';
  bool    _submitted       = false;
  bool    _saving          = false;

  static const _dark  = Color(0xFF1A1A2E);
  static const _green = Color(0xFF4ADE80);
  static const _muted = Color(0xFF4A4A6A);
  static const _bg    = Color(0xFFFAF9F7);

  final List<String> _goals = [
    'Daily Living',
    'Community Participation',
    'Employment',
    'Health & Wellbeing',
    'Home & Living',
    'Relationships',
    'Learning',
  ];

  // Recent notes (placeholder — replaced by Firestore reads)
  final List<Map<String, String>> _recentNotes = [
    {
      'participant': 'Margaret T.',
      'goal':        'Daily Living',
      'date':        '27 Feb 2026',
      'preview':     'Assisted with morning routine. Client engaged well and completed all tasks independently.',
    },
    {
      'participant': 'Robert M.',
      'goal':        'Community Participation',
      'date':        '26 Feb 2026',
      'preview':     'Attended weekly social group. Good interaction with peers. Transport arranged.',
    },
  ];

  Future<void> _saveNote() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    await Future.delayed(const Duration(milliseconds: 600)); // TODO: write to Firestore
    setState(() { _saving = false; _submitted = true; });
    _noteCtrl.clear();
  }

  @override
  void dispose() {
    _noteCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _dark, elevation: 0,
        title: const Text('Session Notes', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── New Note Form ──────────────────────────────────────
            _card(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('New Session Note', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _dark)),
                    const SizedBox(height: 4),
                    Text(DateFormat('EEEE, d MMMM yyyy').format(DateTime.now()),
                        style: TextStyle(fontSize: 12, color: _muted)),
                    const SizedBox(height: 20),

                    // Goal selector
                    Text('Support Goal', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: _dark)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: const Color(0xFFE8E4DD)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedGoal,
                          isExpanded: true,
                          icon: Icon(Icons.keyboard_arrow_down_rounded, color: _muted),
                          items: _goals.map((g) => DropdownMenuItem(value: g, child: Text(g, style: TextStyle(fontSize: 14, color: _dark)))).toList(),
                          onChanged: (v) => setState(() => _selectedGoal = v!),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Note text
                    Text('Session Notes', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: _dark)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _noteCtrl,
                      maxLines: 6,
                      decoration: InputDecoration(
                        hintText: 'Describe what was achieved during this session, client engagement, any concerns…',
                        hintStyle: TextStyle(fontSize: 13, color: _muted),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF1A1A2E), width: 1.5)),
                      ),
                      validator: (v) => v == null || v.trim().length < 20
                          ? 'Please write at least 20 characters'
                          : null,
                    ),
                    const SizedBox(height: 20),

                    if (_submitted) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFF86EFAC)),
                        ),
                        child: Row(children: [
                          Icon(Icons.check_circle_outline_rounded, color: _green, size: 18),
                          const SizedBox(width: 8),
                          const Text('Note saved successfully.', style: TextStyle(fontSize: 13, color: Color(0xFF16A34A))),
                        ]),
                      ),
                      const SizedBox(height: 16),
                    ],

                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _saving ? null : () { setState(() => _submitted = false); _saveNote(); },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _dark, foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        child: _saving
                            ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Save Note', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // ── Recent Notes ───────────────────────────────────────
            Text('Recent Notes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: _dark)),
            const SizedBox(height: 12),
            ..._recentNotes.map((note) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _card(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text(note['participant']!, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: _dark)),
                    Text(note['date']!, style: TextStyle(fontSize: 11, color: _muted)),
                  ]),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(note['goal']!, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF16A34A))),
                  ),
                  const SizedBox(height: 8),
                  Text(note['preview']!, style: TextStyle(fontSize: 13, color: _muted, height: 1.4),
                      maxLines: 2, overflow: TextOverflow.ellipsis),
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
