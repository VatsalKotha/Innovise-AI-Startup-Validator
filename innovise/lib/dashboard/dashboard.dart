import 'package:flutter/material.dart';
import 'package:innovise/dashboard/bar_chart.dart';
import 'package:innovise/dashboard/pie_chart.dart';
import 'package:innovise/dashboard/score_gauge_widget.dart';
import 'package:intl/intl.dart';

import '../common/colors.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  bool show_metrics_breakdown = true;
  bool show_swot_analysis = true;
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Idea Validation Score",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                      DateFormat('EEEE, d MMMM yyyy, HH:mm a')
                          .format(DateTime.now()),
                      style: TextStyle(
                          height: 0.8,
                          fontWeight: FontWeight.bold,
                          fontSize: 9,
                          color: AppColors.primary)),
                ],
              ),
              Row(
                children: [
                  InkWell(
                    onTap: () {},
                    child: Container(
                        padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Icon(
                          Icons.auto_mode_sharp,
                          size: 20,
                        )),
                  ),
                  SizedBox(
                    width: 4,
                  ),
                  InkWell(
                    onTap: () {},
                    child: Container(
                        padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Icon(
                          Icons.save_alt_rounded,
                          size: 20,
                        )),
                  ),
                ],
              ),
            ],
          ),
          SizedBox(
            height: 20,
          ),
          Row(
            children: [
              Expanded(
                child: Container(
                    height: 150,
                    padding: const EdgeInsets.fromLTRB(6, 5, 6, 6),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Flexible(child: ScoreGauge(score: 76)),
                        Container(
                          padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                          decoration: BoxDecoration(
                              color: AppColors.white,
                              borderRadius: BorderRadius.circular(15)),
                          child: Row(
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.trending_up_rounded,
                                    color: AppColors.green,
                                  ),
                                  SizedBox(
                                    width: 5,
                                  ),
                                  Text(
                                    "76",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 25,
                                        color: AppColors.black),
                                  ),
                                  Text(
                                    "\n/100",
                                    style: TextStyle(
                                        height: 0.9,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 10,
                                        color: AppColors.black),
                                  )
                                ],
                              )
                            ],
                          ),
                        ),
                      ],
                    )),
              ),
              Expanded(
                flex: 2,
                child: Container(
                    height: 150,
                    margin: const EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Container(
                      decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius: BorderRadius.circular(15)),
                      child: BarChartWidget(
                        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                        values: [5.0, 3.0, 4.0, 7.0, 6.0],
                        barColor: AppColors.primary,
                      ),
                    )),
              )
            ],
          ),
          SizedBox(
            height: 20,
          ),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.business_center_outlined,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Competitor Analysis",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.store_outlined,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Market Gap",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.attach_money,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Investor Matching",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.chat_bubble_outline_rounded,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "AI Chatbot",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              )
            ],
          ),
          SizedBox(
            height: 8,
          ),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.task_outlined,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Business Plan",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.mic_outlined,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Pitch Generator",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.gavel_outlined,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Legal Compliance",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: InkWell(
                  onTap: () {},
                  child: Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.fromLTRB(6, 10, 6, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Column(
                      children: [
                        Icon(
                          Icons.person_outline,
                          size: 30,
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(5, 5, 5, 0),
                          child: Text(
                            "Manage Profile",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontWeight: FontWeight.w400, fontSize: 12),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              )
            ],
          ),
          SizedBox(
            height: 30,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Metrics Breakdown",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              InkWell(
                onTap: () {
                  setState(() {
                    show_metrics_breakdown = !show_metrics_breakdown;
                  });
                },
                child: Container(
                    padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Icon(
                      show_metrics_breakdown
                          ? Icons.expand_less_rounded
                          : Icons.expand_more_rounded,
                      size: 20,
                    )),
              ),
            ],
          ),
          show_metrics_breakdown
              ? Column(
                  children: [
                    Container(
                        height: 250,
                        width: double.infinity,
                        margin: EdgeInsets.only(top: 10),
                        padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Container(
                          decoration: BoxDecoration(
                              color: AppColors.white,
                              borderRadius: BorderRadius.circular(15)),
                          child: PieChartWidget(values: [
                            8.0,
                            5.0,
                            3.0,
                            7.0
                          ], labels: [
                            "Market Demand",
                            "Feasibility",
                            "Scalability",
                            "Sustainability"
                          ]),
                        )),
                    Container(
                      width: double.infinity,
                      margin: EdgeInsets.only(top: 10),
                      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                      decoration: BoxDecoration(
                          color: AppColors.primaryVariant,
                          borderRadius: BorderRadius.circular(15)),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Market Demand",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                  Text("Understanding of market demand",
                                      style: TextStyle(
                                          height: 0.8,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppColors.primary)),
                                ],
                              ),
                              Container(
                                decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(15)),
                                padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                                child: Text("8/10",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: AppColors.black)),
                              )
                            ],
                          ),
                          Divider(
                            color: AppColors.grey,
                            thickness: 0.8,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                color: AppColors.greenAccent,
                                borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
                            child: Text(
                                "The market demand for your product is high. You have a good chance of success.",
                                style: TextStyle(
                                    fontWeight: FontWeight.w400, fontSize: 12)),
                          )
                        ],
                      ),
                    ),
                    Container(
                      width: double.infinity,
                      margin: EdgeInsets.only(top: 10),
                      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                      decoration: BoxDecoration(
                          color: AppColors.primaryVariant,
                          borderRadius: BorderRadius.circular(15)),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Feasibility",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                  Text("Feasibility of the idea",
                                      style: TextStyle(
                                          height: 0.8,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppColors.primary)),
                                ],
                              ),
                              Container(
                                decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(15)),
                                padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                                child: Text("5/10",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: AppColors.black)),
                              )
                            ],
                          ),
                          Divider(
                            color: AppColors.grey,
                            thickness: 0.8,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                color: AppColors.yellowAccent,
                                borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
                            child: Text(
                                "The feasibility of your idea is average. You may need to make some changes to your idea to make it more feasible.",
                                style: TextStyle(
                                    fontWeight: FontWeight.w400, fontSize: 12)),
                          )
                        ],
                      ),
                    ),
                    Container(
                      width: double.infinity,
                      margin: EdgeInsets.only(top: 10),
                      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                      decoration: BoxDecoration(
                          color: AppColors.primaryVariant,
                          borderRadius: BorderRadius.circular(15)),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Scalability",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                  Text("Scalability of the idea",
                                      style: TextStyle(
                                          height: 0.8,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppColors.primary)),
                                ],
                              ),
                              Container(
                                decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(15)),
                                padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                                child: Text("3/10",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: AppColors.black)),
                              )
                            ],
                          ),
                          Divider(
                            color: AppColors.grey,
                            thickness: 0.8,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                color: AppColors.redAccent,
                                borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
                            child: Text(
                                "The scalability of your idea is low. You may need to rethink your idea to make it more scalable.",
                                style: TextStyle(
                                    fontWeight: FontWeight.w400, fontSize: 12)),
                          )
                        ],
                      ),
                    ),
                    Container(
                      width: double.infinity,
                      margin: EdgeInsets.only(top: 10),
                      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                      decoration: BoxDecoration(
                          color: AppColors.primaryVariant,
                          borderRadius: BorderRadius.circular(15)),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Sustainability",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                  Text("Sustainability of the idea",
                                      style: TextStyle(
                                          height: 0.8,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: AppColors.primary)),
                                ],
                              ),
                              Container(
                                decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(15)),
                                padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                                child: Text("7/10",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: AppColors.black)),
                              )
                            ],
                          ),
                          Divider(
                            color: AppColors.grey,
                            thickness: 0.8,
                          ),
                          Container(
                            decoration: BoxDecoration(
                                color: AppColors.greenAccent,
                                borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
                            child: Text(
                                "The sustainability of your idea is high. Your idea has the potential to be sustainable in the long term.",
                                style: TextStyle(
                                    fontWeight: FontWeight.w400, fontSize: 12)),
                          )
                        ],
                      ),
                    ),
                  ],
                )
              : SizedBox(),
          SizedBox(
            height: 30,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "SWOT Analysis",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              InkWell(
                onTap: () {
                  setState(() {
                    show_swot_analysis = !show_swot_analysis;
                  });
                },
                child: Container(
                    padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(15)),
                    child: Icon(
                      show_swot_analysis
                          ? Icons.expand_less_rounded
                          : Icons.expand_more_rounded,
                      size: 20,
                    )),
              ),
            ],
          ),
          show_swot_analysis
              ? Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: GridView.builder(
                    physics: NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 1,
                        mainAxisSpacing: 8,
                        crossAxisSpacing: 8),
                    itemCount: 4,
                    itemBuilder: (context, index) {
                      return Container(
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Strengths",
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text("Strengths of the idea",
                                style: TextStyle(
                                    height: 0.8,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 10,
                                    color: AppColors.primary)),
                            Divider(
                              color: AppColors.grey,
                              thickness: 0.8,
                            ),
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                    color: AppColors.white,
                                    borderRadius: BorderRadius.circular(10)),
                                padding:
                                    const EdgeInsets.fromLTRB(8, 10, 8, 10),
                                child: Text(
                                    "The strengths of your idea are its high market demand and sustainability.",
                                    style: TextStyle(
                                        fontWeight: FontWeight.w400,
                                        fontSize: 12)),
                              ),
                            )
                          ],
                        ),
                      );
                    },
                  ),
                )
              : SizedBox(),
        ],
      ),
    );
  }
}
