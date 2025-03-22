import 'dart:math';
import 'package:flutter/material.dart';
import 'package:innovise/common/colors.dart';

class FlowChartScreen extends StatefulWidget {
  final List<Map<String, dynamic>> nodes;
  final List<Map<String, dynamic>> edges;

  FlowChartScreen(this.nodes, this.edges);

  @override
  _FlowChartScreenState createState() => _FlowChartScreenState();
}

class _FlowChartScreenState extends State<FlowChartScreen> {
  Map<String, Offset> nodePositions = {};
  TransformationController _transformationController =
      TransformationController();

  @override
  void initState() {
    super.initState();
    initializeNodePositions();

    // Set initial zoom level (0.8 means zoomed out to 80%)
    _transformationController.value = Matrix4.identity().scaled(0.7);
  }

  void initializeNodePositions() {
    for (var node in widget.nodes) {
      nodePositions[node["id"]] = Offset(
        (node["position"]["x"] as num).toDouble(),
        (node["position"]["y"] as num).toDouble(),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: InteractiveViewer(
        transformationController:
            _transformationController, // Apply zoom-out effect
        boundaryMargin: EdgeInsets.all(100),
        minScale: 0.5,
        maxScale: 2.0,
        constrained: false,
        child: SizedBox(
          width: 800,
          height: 800,
          child: Stack(
            children: [
              CustomPaint(
                painter: EdgePainter(widget.edges, nodePositions),
                child: Container(),
              ),
              ...widget.nodes.map((node) => buildDraggableNode(node)).toList(),
              ...widget.edges.map((edge) => buildStepLabel(edge)).toList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildDraggableNode(Map<String, dynamic> node) {
    return Positioned(
      left: nodePositions[node["id"]]!.dx,
      top: nodePositions[node["id"]]!.dy,
      child: Draggable(
        feedback: nodeWidget(node),
        childWhenDragging: Opacity(opacity: 0.5, child: nodeWidget(node)),
        onDragEnd: (drag) {
          setState(() {
            nodePositions[node["id"]] = Offset(
              max(0, drag.offset.dx),
              max(0, drag.offset.dy),
            );
          });
        },
        child: nodeWidget(node),
      ),
    );
  }

  Widget nodeWidget(Map<String, dynamic> node) {
    String label = node["data"]["label"];
    List<String> labelParts = label.split(' - ');
    String title = labelParts.first;
    String description =
        labelParts.length > 1 ? labelParts.sublist(1).join(' - ') : "";

    return GestureDetector(
      onTap: () => print("Tapped: ${node['id']}"),
      child: Container(
        width: 220,
        padding: EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.primaryVariant,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: AppColors.primary, width: 1),
        ),
        child: Column(
          children: [
            Text(title,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            Divider(height: 10, indent: 20, endIndent: 20),
            Text(description,
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary)),
          ],
        ),
      ),
    );
  }

  Widget buildStepLabel(Map<String, dynamic> edge) {
    if (!nodePositions.containsKey(edge["source"]) ||
        !nodePositions.containsKey(edge["target"])) return Container();

    Offset start = nodePositions[edge["source"]]!;
    Offset end = nodePositions[edge["target"]]!;
    Offset mid = Offset((start.dx + end.dx) / 2, (start.dy + end.dy) / 2 - 10);

    return Positioned(
      left: mid.dx,
      top: mid.dy,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(edge["label"],
            style: TextStyle(color: Colors.white, fontSize: 12)),
      ),
    );
  }
}

class EdgePainter extends CustomPainter {
  final List<Map<String, dynamic>> edges;
  final Map<String, Offset> nodePositions;

  EdgePainter(this.edges, this.nodePositions);

  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()
      ..color = Colors.black
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    for (var edge in edges) {
      if (nodePositions.containsKey(edge["source"]) &&
          nodePositions.containsKey(edge["target"])) {
        Offset start = nodePositions[edge["source"]]! + Offset(100, 40);
        Offset end = nodePositions[edge["target"]]! + Offset(100, 0);
        canvas.drawLine(start, end, paint);
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
