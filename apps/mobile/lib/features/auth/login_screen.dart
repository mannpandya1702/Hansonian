import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

// ── US.M1: Caregiver Authentication ─────────────────────────────────────────
// Firebase Auth sign-in with email + password.
// On success routes to /shifts (home screen).
// ────────────────────────────────────────────────────────────────────────────

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey    = GlobalKey<FormState>();
  final _emailCtrl  = TextEditingController();
  final _passCtrl   = TextEditingController();

  bool _obscure  = true;
  bool _loading  = false;
  String? _error;

  static const _dark  = Color(0xFF1A1A2E);
  static const _green = Color(0xFF4ADE80);
  static const _muted = Color(0xFF4A4A6A);
  static const _bg    = Color(0xFFFAF9F7);

  Future<void> _signIn() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });

    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email:    _emailCtrl.text.trim(),
        password: _passCtrl.text,
      );
      if (mounted) Navigator.of(context).pushReplacementNamed('/shifts');
    } on FirebaseAuthException catch (e) {
      setState(() {
        _error = switch (e.code) {
          'user-not-found'        => 'No account found with this email.',
          'wrong-password'        => 'Incorrect password. Please try again.',
          'invalid-email'         => 'Please enter a valid email address.',
          'too-many-requests'     => 'Too many attempts. Please wait and try again.',
          'network-request-failed'=> 'Network error. Check your connection.',
          _                       => 'Sign-in failed. Please try again.',
        };
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
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
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 4,
                            color: _dark,
                          )),
                    ]),
                    const SizedBox(height: 4),
                    Container(width: 32, height: 2, color: _green),
                    const SizedBox(height: 40),

                    Text('Welcome back',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w600,
                          color: _dark,
                        )),
                    const SizedBox(height: 6),
                    Text('Sign in to access your caregiver portal',
                        style: TextStyle(fontSize: 14, color: _muted)),
                    const SizedBox(height: 32),

                    // Email
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      decoration: _inputDecoration('Email address', Icons.email_outlined),
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Email is required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Password
                    TextFormField(
                      controller: _passCtrl,
                      obscureText: _obscure,
                      textInputAction: TextInputAction.done,
                      onFieldSubmitted: (_) => _signIn(),
                      decoration: _inputDecoration('Password', Icons.lock_outline).copyWith(
                        suffixIcon: IconButton(
                          icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              size: 20, color: _muted),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty ? 'Password is required' : null,
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
                        child: Row(children: [
                          const Icon(Icons.warning_amber_rounded, size: 16, color: Color(0xFFDC2626)),
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
                            ? const SizedBox(
                                width: 20, height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Sign In Securely',
                                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                      ),
                    ),

                    const SizedBox(height: 24),
                    Center(
                      child: Text('Having trouble? Contact your manager.',
                          style: TextStyle(fontSize: 12, color: _muted)),
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

  InputDecoration _inputDecoration(String label, IconData icon) => InputDecoration(
    labelText: label,
    prefixIcon: Icon(icon, size: 20, color: const Color(0xFFB0A9A0)),
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFE8E4DD)),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFE8E4DD)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFF1A1A2E), width: 1.5),
    ),
    labelStyle: const TextStyle(color: Color(0xFF4A4A6A), fontSize: 14),
  );
}
