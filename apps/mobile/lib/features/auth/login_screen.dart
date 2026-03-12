import 'package:flutter/material.dart';

// ── US.M1: Caregiver Authentication ─────────────────────────────────────────
// Demo mode: hardcoded credentials while Firebase is not yet configured.
// Replace the _signIn() body with FirebaseAuth once credentials are available.
// ────────────────────────────────────────────────────────────────────────────

// Demo credentials (remove once Firebase is live)
const _demoEmail    = 'caregiver@hansonium.com.au';
const _demoPassword = 'demo1234';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey    = GlobalKey<FormState>();
  final _emailCtrl  = TextEditingController();
  final _passCtrl   = TextEditingController();

  bool    _obscure  = true;
  bool    _loading  = false;
  String? _error;

  static const _dark  = Color(0xFF1A1A2E);
  static const _green = Color(0xFF4ADE80);
  static const _muted = Color(0xFF4A4A6A);
  static const _bg    = Color(0xFFFAF9F7);

  Future<void> _signIn() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });

    await Future.delayed(const Duration(milliseconds: 500));

    final email = _emailCtrl.text.trim().toLowerCase();
    final pass  = _passCtrl.text;

    if (email == _demoEmail && pass == _demoPassword) {
      if (mounted) Navigator.of(context).pushReplacementNamed('/shifts');
    } else {
      setState(() {
        _error   = 'Invalid email or password.\nUse the demo credentials below.';
        _loading = false;
      });
    }
  }

  void _fillDemo() {
    _emailCtrl.text = _demoEmail;
    _passCtrl.text  = _demoPassword;
    setState(() => _error = null);
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Logo
                    Row(children: [
                      Text('HANSONIUM',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, letterSpacing: 4, color: _dark)),
                    ]),
                    const SizedBox(height: 4),
                    Container(width: 32, height: 2, color: _green),
                    const SizedBox(height: 40),

                    Text('Welcome back',
                        style: TextStyle(fontSize: 28, fontWeight: FontWeight.w600, color: _dark)),
                    const SizedBox(height: 6),
                    Text('Sign in to access your caregiver portal',
                        style: TextStyle(fontSize: 14, color: _muted)),
                    const SizedBox(height: 32),

                    // Email
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      decoration: _inputDec('Email address', Icons.email_outlined),
                      validator: (v) => v == null || v.isEmpty ? 'Email is required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Password
                    TextFormField(
                      controller: _passCtrl,
                      obscureText: _obscure,
                      textInputAction: TextInputAction.done,
                      onFieldSubmitted: (_) => _signIn(),
                      decoration: _inputDec('Password', Icons.lock_outline).copyWith(
                        suffixIcon: IconButton(
                          icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              size: 20, color: _muted),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Password is required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Error
                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          border: Border.all(color: const Color(0xFFFECACA)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          const Padding(
                            padding: EdgeInsets.only(top: 1),
                            child: Icon(Icons.warning_amber_rounded, size: 16, color: Color(0xFFDC2626)),
                          ),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_error!, style: const TextStyle(fontSize: 13, color: Color(0xFFDC2626)))),
                        ]),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Sign in button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _signIn,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _dark,
                          disabledBackgroundColor: _dark.withAlpha(153),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        child: _loading
                            ? const SizedBox(width: 20, height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Sign In', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Demo credentials hint
                    GestureDetector(
                      onTap: _fillDemo,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0EDE6),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE8E4DD)),
                        ),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Icon(Icons.info_outline_rounded, size: 14, color: _muted),
                            const SizedBox(width: 6),
                            Text('Demo credentials — tap to fill', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _muted, letterSpacing: 0.5)),
                          ]),
                          const SizedBox(height: 8),
                          _credRow('Email',    _demoEmail),
                          const SizedBox(height: 4),
                          _credRow('Password', _demoPassword),
                        ]),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _credRow(String label, String value) => Row(children: [
    SizedBox(width: 60, child: Text('$label:', style: TextStyle(fontSize: 12, color: _muted))),
    Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _dark,
        fontFamily: 'monospace')),
  ]);

  InputDecoration _inputDec(String label, IconData icon) => InputDecoration(
    labelText: label,
    prefixIcon: Icon(icon, size: 20, color: const Color(0xFFB0A9A0)),
    filled: true,
    fillColor: Colors.white,
    border:        OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE8E4DD))),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF1A1A2E), width: 1.5)),
    labelStyle: const TextStyle(color: Color(0xFF4A4A6A), fontSize: 14),
  );
}
