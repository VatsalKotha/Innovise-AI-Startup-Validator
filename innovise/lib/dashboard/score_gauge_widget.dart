import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_gauges/gauges.dart';

class ScoreGauge extends StatelessWidget {
  final double score;

  ScoreGauge({required this.score});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(15, 5, 15, 5),
      child: SfRadialGauge(
        axes: <RadialAxis>[
          RadialAxis(
            canScaleToFit: true,
            minimum: 0,
            maximum: 100,
            startAngle: 180,
            endAngle: 0,
            radiusFactor: 1.2,
            showLabels: false,
            showTicks: false,
            axisLineStyle: AxisLineStyle(
              thickness: 0.2,
              thicknessUnit: GaugeSizeUnit.factor,
              color: Colors.grey[300],
            ),
            ranges: <GaugeRange>[
              GaugeRange(
                startValue: 0,
                endValue: 33,
                color: Colors.red,
                startWidth: 0.2,
                endWidth: 0.2,
                sizeUnit: GaugeSizeUnit.factor,
              ),
              GaugeRange(
                startValue: 33,
                endValue: 66,
                color: Colors.yellow,
                startWidth: 0.2,
                endWidth: 0.2,
                sizeUnit: GaugeSizeUnit.factor,
              ),
              GaugeRange(
                startValue: 66,
                endValue: 100,
                color: Colors.green,
                startWidth: 0.2,
                endWidth: 0.2,
                sizeUnit: GaugeSizeUnit.factor,
              ),
            ],
            pointers: <GaugePointer>[
              NeedlePointer(
                value: score,
                needleColor: Colors.black,
                knobStyle: KnobStyle(color: Colors.black),
                needleLength: 0.8,
                needleStartWidth: 1.5,
                needleEndWidth: 4,
                lengthUnit: GaugeSizeUnit.factor,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
