import 'package:flutter/material.dart';
import 'features/auth/login_screen.dart';
import 'features/shifts/shifts_screen.dart';
import 'features/notes/notes_screen.dart';
import 'features/incidents/incidents_screen.dart';

// ── Hansonian Caregiver Mobile App ───────────────────────────────────────────
// Entry point — sets up named routes for all 4 feature modules.
// Firebase.initializeApp() should be called here once credentials are set.
// ─────────────────────────────────────────────────────────────────────────────

void main() {
  // TODO: uncomment when Firebase credentials are available
  // WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp();
  runApp(const HansonianApp());
}

class HansonianApp extends StatelessWidget {
  const HansonianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hansonian Caregiver',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1A1A2E)),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFFAF9F7),
        fontFamily: 'Inter',
      ),
      initialRoute: '/login',
      routes: {
        '/login':     (_) => const LoginScreen(),
        '/shifts':    (_) => const MainShell(initialIndex: 0),
        '/notes':     (_) => const MainShell(initialIndex: 1),
        '/incidents': (_) => const MainShell(initialIndex: 2),
      },
    );
  }
}

// ── Bottom-nav shell wrapping all authenticated screens ──────────────────────
class MainShell extends StatefulWidget {
  final int initialIndex;
  const MainShell({super.key, this.initialIndex = 0});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  late int _index;

  @override
  void initState() {
    super.initState();
    _index = widget.initialIndex;
  }

  static const _screens = [
    ShiftsScreen(),
    NotesScreen(),
    IncidentsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFF4ADE80).withAlpha(51),
        destinations: const [
          NavigationDestination(
            icon:         Icon(Icons.schedule_outlined),
            selectedIcon: Icon(Icons.schedule_rounded),
            label:        'Shifts',
          ),
          NavigationDestination(
            icon:         Icon(Icons.note_alt_outlined),
            selectedIcon: Icon(Icons.note_alt_rounded),
            label:        'Notes',
          ),
          NavigationDestination(
            icon:         Icon(Icons.warning_amber_outlined),
            selectedIcon: Icon(Icons.warning_amber_rounded),
            label:        'Incidents',
          ),
        ],
      ),
    );
  }
}
