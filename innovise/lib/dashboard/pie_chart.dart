import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

class PieChartWidget extends StatelessWidget {
  final List<double> values;
  final List<String> labels;

  PieChartWidget({
    required this.values,
    required this.labels,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(5.0),
      child: PieChart(
        PieChartData(
          sections: List.generate(values.length, (index) {
            return PieChartSectionData(
              value: values[index],
              title: labels[index],
              titleStyle: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.black),
              radius: 60,
              color: _getGradientColor(index),
            );
          }),
          sectionsSpace: 2,
          centerSpaceRadius: 40,
        ),
      ),
    );
  }

  Color _getGradientColor(int index) {
    List<Color> gradientColors = [
      Color(0xFF9A9285),
      Color(0xFFF3F0E7),
      Color(0xFFD6CBBE),
      Color(0xFFC0B8A4),
    ];
    return gradientColors[index % gradientColors.length];
  }
}
