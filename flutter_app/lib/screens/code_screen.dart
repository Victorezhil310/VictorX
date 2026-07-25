import 'package:flutter/material.dart';

class CodeScreen extends StatelessWidget {
  const CodeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
              onPressed: () {},
              icon: const Icon(Icons.code),
              label: const Text('Synthesize App Code'),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const SingleChildScrollView(
                  child: Text(
                    '// Synthesized Flutter & Python Code App\nvoid main() {\n  runApp(const VictorXApp());\n}',
                    style: TextStyle(fontFamily: 'monospace', color: Colors.greenAccent),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
