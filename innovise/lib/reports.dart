import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:innovise/common/colors.dart';
import 'package:innovise/dashboard/bar_chart.dart';
import 'package:innovise/dashboard/score_gauge_widget.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:widgets_to_png/widgets_to_png.dart' as wd;

final class Reports {
  static const PdfColor primary = PdfColor.fromInt(0xFF9A9285);
  static const PdfColor primaryVariant = PdfColor.fromInt(0xFFF3F0E7);
  static const PdfColor secondary = PdfColor.fromInt(0xFFD6CBBE);
  static const PdfColor grey = PdfColor.fromInt(0xFFE0E0E0);
  static const PdfColor black = PdfColor.fromInt(0xFF1E1E1E);
  static const PdfColor white = PdfColor.fromInt(0xFFFFFFFF);
  static const PdfColor red = PdfColor.fromInt(0xFFFF0606);
  static const PdfColor redAccent = PdfColor.fromInt(0xFFFFEDED);
  static const PdfColor green = PdfColor.fromInt(0xFF00B633);
  static const PdfColor greenAccent = PdfColor.fromInt(0xFFEBFFF0);
  static const PdfColor yellow = PdfColor.fromInt(0xFFECBB0D);
  static const PdfColor yellowAccent = PdfColor.fromInt(0xFFFFF6D7);

  static Future<Uint8List> generateDashboardPdf(var data) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        clip: true,
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        "Idea Validation Score",
                        style: pw.TextStyle(
                            fontWeight: pw.FontWeight.bold, fontSize: 16),
                      ),
                      pw.Text(
                          DateFormat('EEEE, d MMMM yyyy, HH:mm').format(
                              HttpDate.parse(data['date_of_creation'])
                                  .toLocal()),
                          style: pw.TextStyle(
                              height: 0.8,
                              fontWeight: pw.FontWeight.bold,
                              fontSize: 9,
                              color: primary)),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(
                height: 20,
              ),
              pw.Row(
                children: [
                  pw.Expanded(
                    child: pw.Container(
                        height: 150,
                        padding: const pw.EdgeInsets.fromLTRB(6, 5, 6, 6),
                        decoration: pw.BoxDecoration(
                            color: primaryVariant,
                            borderRadius: pw.BorderRadius.circular(15)),
                        child: pw.Column(
                          mainAxisSize: pw.MainAxisSize.min,
                          children: [
                            // pw.Flexible(
                            //     child: ScoreGauge(
                            //         score: double.parse(
                            //             data['success_score']
                            //                 .toString()))),
                            pw.Container(
                              padding: const pw.EdgeInsets.fromLTRB(8, 5, 8, 5),
                              decoration: pw.BoxDecoration(
                                  color: white,
                                  borderRadius: pw.BorderRadius.circular(15)),
                              child: pw.Row(
                                mainAxisAlignment: pw.MainAxisAlignment.center,
                                children: [
                                  pw.Row(
                                    mainAxisAlignment:
                                        pw.MainAxisAlignment.center,
                                    children: [
                                      // data['success_score'] < 50
                                      //     ? pw.Icon(
                                      //         Icons.trending_down_rounded,
                                      //         color: red,
                                      //       )
                                      //     : pw.Icon(
                                      //         Icons.trending_up_rounded,
                                      //         color: green,
                                      //       ),
                                      pw.SizedBox(
                                        width: 5,
                                      ),
                                      pw.Text(
                                        data['success_score'].toString(),
                                        style: pw.TextStyle(
                                            fontWeight: pw.FontWeight.bold,
                                            fontSize: 25,
                                            color: black),
                                      ),
                                      pw.Text(
                                        "\n/100",
                                        style: pw.TextStyle(
                                            height: 0.9,
                                            fontWeight: pw.FontWeight.bold,
                                            fontSize: 10,
                                            color: black),
                                      )
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        )),
                  ),
                  // pw.Expanded(
                  //   flex: 2,
                  //   child: pw.Container(
                  //       height: 150,
                  //       margin: const pw.EdgeInsets.only(left: 8),
                  //       padding: const pw.EdgeInsets.fromLTRB(8, 8, 8, 8),
                  //       decoration: pw.BoxDecoration(
                  //           color: primaryVariant,
                  //           borderRadius: pw.BorderRadius.circular(15)),
                  //       child: pw.Container(
                  //           decoration: pw.BoxDecoration(
                  //               color: white,
                  //               borderRadius: pw.BorderRadius.circular(15)),
                  //           child: image1)),
                  // )
                ],
              ),
              InfoCard(data['final_verdict']),
              // pw.SizedBox(

              pw.SizedBox(
                height: 10,
              ),

              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    "SWOT Analysis",
                    style: pw.TextStyle(
                        fontWeight: pw.FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
              pw.Container(
                padding: const pw.EdgeInsets.only(top: 10),
                child: pw.Row(
                  children: [
                    pw.Expanded(
                      child: SWOTCard("Strengths", "Strengths of the idea",
                          data['swot']['strengths']),
                    ),
                    pw.Expanded(
                      child: SWOTCard("Weakness", "Weakness of the idea",
                          data['swot']['weaknesses']),
                    ),
                  ],
                ),
              ),
              pw.Container(
                padding: const pw.EdgeInsets.only(top: 10),
                child: pw.Row(
                  children: [
                    pw.Expanded(
                      child: SWOTCard(
                          "Opportunities",
                          "Opportunities for the idea",
                          data['swot']['opportunities']),
                    ),
                    pw.Expanded(
                      child: SWOTCard("Threats", "Threats to the idea",
                          data['swot']['threats']),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );

    pdf.addPage(pw.Page(build: (pw.Context context) {
      return pw.Column(children: [
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text(
              "Metrics Breakdown",
              style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
        pw.Column(
          children: [
            MarketBreakdownCard(
                "Market Demand",
                "Market demand for the idea",
                data['metrics']['market_demand']['score'],
                data['metrics']['market_demand']['explanation']),
            MarketBreakdownCard(
                "Feasibility",
                "Feasibility of the idea",
                data['metrics']['feasibility']['score'],
                data['metrics']['feasibility']['explanation']),
            MarketBreakdownCard(
                "Scalability",
                "Scalability of the idea",
                data['metrics']['scalability']['score'],
                data['metrics']['scalability']['explanation']),
            MarketBreakdownCard(
                "Sustainability",
                "Sustainability of the idea",
                data['metrics']['sustainability']['score'],
                data['metrics']['sustainability']['explanation']),
            InfoCard(data['detailed_analysis'])
          ],
        ),
      ]);
    }));

    return pdf.save();
  }

  static pw.Widget MarketBreakdownCard(
      String title, String subtitle, int score, String explanation) {
    return pw.Container(
      width: double.infinity,
      margin: pw.EdgeInsets.only(top: 10),
      padding: const pw.EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: pw.BoxDecoration(
          color: primaryVariant, borderRadius: pw.BorderRadius.circular(15)),
      child: pw.Column(
        children: [
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            children: [
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text(
                    title,
                    style: pw.TextStyle(
                        fontWeight: pw.FontWeight.bold, fontSize: 16),
                  ),
                  pw.Text(subtitle,
                      style: pw.TextStyle(
                          height: 0.8,
                          fontWeight: pw.FontWeight.bold,
                          fontSize: 12,
                          color: primary)),
                ],
              ),
              pw.Container(
                decoration: pw.BoxDecoration(
                    color: white, borderRadius: pw.BorderRadius.circular(15)),
                padding: const pw.EdgeInsets.fromLTRB(8, 5, 8, 5),
                child: pw.Text(score.toString() + "/10",
                    style: pw.TextStyle(
                        fontWeight: pw.FontWeight.bold,
                        fontSize: 16,
                        color: black)),
              )
            ],
          ),
          pw.Divider(
            color: grey,
            thickness: 0.8,
          ),
          pw.Container(
            decoration: pw.BoxDecoration(
                color: score < 4
                    ? redAccent
                    : score < 7
                        ? yellowAccent
                        : greenAccent,
                borderRadius: pw.BorderRadius.circular(10)),
            padding: const pw.EdgeInsets.fromLTRB(8, 10, 8, 10),
            child: pw.Text(explanation,
                style: pw.TextStyle(
                    fontWeight: pw.FontWeight.normal, fontSize: 12)),
          )
        ],
      ),
    );
  }

  static pw.Widget InfoCard(String info) {
    return pw.Container(
      width: double.infinity,
      margin: pw.EdgeInsets.only(top: 10, bottom: 10),
      padding: const pw.EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: pw.BoxDecoration(
          color: primaryVariant, borderRadius: pw.BorderRadius.circular(15)),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Row(
            children: [
              pw.Expanded(
                child: pw.Text(
                  info,
                  style: pw.TextStyle(
                      fontWeight: pw.FontWeight.normal, fontSize: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  static pw.Widget SWOTCard(String title, String subtitle, List data) {
    return pw.Container(
      height: 180,
      margin: pw.EdgeInsets.only(right: 10),
      padding: pw.EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: pw.BoxDecoration(
          color: primaryVariant, borderRadius: pw.BorderRadius.circular(15)),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text(
            title,
            style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 14),
          ),
          pw.Text(subtitle,
              style: pw.TextStyle(
                  height: 0.8,
                  fontWeight: pw.FontWeight.bold,
                  fontSize: 10,
                  color: primary)),
          pw.Divider(
            color: grey,
            thickness: 0.8,
          ),
          pw.Expanded(
            child: pw.Container(
              width: double.infinity,
              decoration: pw.BoxDecoration(
                  color: white, borderRadius: pw.BorderRadius.circular(10)),
              padding: pw.EdgeInsets.fromLTRB(8, 10, 8, 10),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  for (var d in data)
                    pw.Padding(
                      padding: const pw.EdgeInsets.only(bottom: 5),
                      child: pw.Text(d,
                          style: pw.TextStyle(
                              fontWeight: pw.FontWeight.normal, fontSize: 12)),
                    ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
