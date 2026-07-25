import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const VictorXApp());
}

class VictorXApp extends StatelessWidget {
  const VictorXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VictorX AI Platform 1.0.0',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF090D16),
        primaryColor: const Color(0xFF6366F1),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFFA855F7),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
