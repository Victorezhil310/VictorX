import 'package:flutter/material.dart';
import 'chat_screen.dart';
import 'image_screen.dart';
import 'video_screen.dart';
import 'code_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    ChatScreen(),
    ImageScreen(),
    VideoScreen(),
    CodeScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('VictorX AI Platform v1.0.0'),
        backgroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.shield),
            onPressed: () {},
            tooltip: 'Confidential Privacy',
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFF6366F1),
        unselectedItemColor: Colors.grey,
        backgroundColor: const Color(0xFF0F172A),
        type: BottomNavigationBarType.fixed,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.palette), label: 'Image'),
          BottomNavigationBarItem(icon: Icon(Icons.movie), label: 'Video'),
          BottomNavigationBarItem(icon: Icon(Icons.code), label: 'Code'),
        ],
      ),
    );
  }
}
