import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Care Pulse',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            children: [
              const SizedBox(height: 20),
              const Text(
                'CARE PULSE',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 4,
                  color: Color(0xFF1A56DB),
                ),
              ),
              const SizedBox(height: 60),

              // The Premium "Neumorphic" Clock-In Button
              Container(
                height: 280,
                width: 280,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF1A56DB),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x601A56DB),
                      blurRadius: 40,
                      offset: Offset(0, 20),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1A56DB),
                    shape: const CircleBorder(),
                    elevation: 0,
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.timer_outlined, size: 80, color: Colors.white),
                      SizedBox(height: 16),
                      Text(
                        'CLOCK IN',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 20,
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 80),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'SCHEDULED CLIENTS',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 10,
                    color: Colors.blueGrey,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
              // Client cards would go here...
            ],
          ),
        ),
      ),
    );
  }
}
