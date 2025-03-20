//TODO: CHECK IF DATA FILLED
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/common/home.dart';
import 'package:innovise/dashboard/bar_chart.dart';
import 'package:innovise/dashboard/pie_chart.dart';
import 'package:innovise/dashboard/score_gauge_widget.dart';
import 'package:innovise/formpage/form_main.dart';
import 'package:innovise/market_gap/market_gap.dart';
import 'package:innovise/profile/profile.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../common/colors.dart';
import '../formpage/constant_data.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  bool show_metrics_breakdown = true;
  bool show_swot_analysis = true;
  bool show_news = true;
  Future analyseData() async {
    try {
      Get.dialog(Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            height: 100,
            width: 100,
            decoration: BoxDecoration(
                color: Colors.white.withAlpha(150),
                borderRadius: BorderRadius.circular(10)),
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          ),
        ],
      ));
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? uid = prefs.getString('uid');

      if (uid == null) {
        Get.back();
        throw Exception('User not logged in');
      }

      var response = await Dio().post(
        '${ConstantData.server_url}/create_idea_validation',
        data: {
          'uid': uid,
        },
      );

      if (response.statusCode == 200) {
        print(response.data['data']);
        Get.back();
        fetchData();
        setState(() {});
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      Get.back();
      Get.snackbar('Error', e.toString());
      return null;
    }
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  var data;

  Future fetchData() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? uid = prefs.getString('uid');

      if (uid == null) {
        throw Exception('User not logged in');
      }

      var response = await Dio().get(
        '${ConstantData.server_url}/get_latest_idea_validation',
        queryParameters: {
          'uid': uid,
        },
      );

      if (response.statusCode == 200) {
        data = response.data;
        print(response.data);
        setState(() {});
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      // Get.snackbar('Error', e.toString());

      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return data == null
        ? Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Center(
                child: Container(
                  height: 100,
                  width: 100,
                  decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(10)),
                  child: const Center(
                    child: CircularProgressIndicator(),
                  ),
                ),
              ),
            ],
          )
        : data['error'] != null
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text("You have not filled any data yet"),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: () {
                          Get.offAll(() => const FormMain());
                        },
                        child: Container(
                          decoration: BoxDecoration(
                              color: AppColors.primaryVariant,
                              borderRadius: BorderRadius.circular(40)),
                          margin: const EdgeInsets.only(top: 20, bottom: 20),
                          padding: const EdgeInsets.fromLTRB(15, 10, 5, 10),
                          child: const Row(
                            children: [
                              Text(
                                'Take up the Questionnaire',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              SizedBox(
                                width: 0,
                              ),
                              Icon(Icons.chevron_right_rounded),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              )
            : SingleChildScrollView(
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
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text(
                                DateFormat('EEEE, d MMMM yyyy, HH:mm').format(
                                    HttpDate.parse(data['date_of_creation'])
                                        .toLocal()),
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
                              onTap: () {
                                analyseData();
                              },
                              child: Container(
                                  padding:
                                      const EdgeInsets.fromLTRB(8, 5, 8, 5),
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
                                  padding:
                                      const EdgeInsets.fromLTRB(8, 5, 8, 5),
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
                                  Flexible(
                                      child: ScoreGauge(
                                          score: double.parse(
                                              data['success_score']
                                                  .toString()))),
                                  Container(
                                    padding:
                                        const EdgeInsets.fromLTRB(8, 5, 8, 5),
                                    decoration: BoxDecoration(
                                        color: AppColors.white,
                                        borderRadius:
                                            BorderRadius.circular(15)),
                                    child: Row(
                                      children: [
                                        Row(
                                          children: [
                                            data['success_score'] < 50
                                                ? Icon(
                                                    Icons.trending_down_rounded,
                                                    color: AppColors.red,
                                                  )
                                                : Icon(
                                                    Icons.trending_up_rounded,
                                                    color: AppColors.green,
                                                  ),
                                            SizedBox(
                                              width: 5,
                                            ),
                                            Text(
                                              data['success_score'].toString(),
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
                                  labels: List<String>.from(
                                      data['past_dates'] ?? []),
                                  values: List<double>.from(
                                      data['past_scores'] ?? []),
                                  barColor: AppColors.primary,
                                ),
                              )),
                        )
                      ],
                    ),
                    InfoCard(data['final_verdict']),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Competitor Analysis",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
                                    ),
                                  )
                                ],
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              Get.to(() => const MarketGap());
                            },
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Market Gap",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Investor Matching",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "AI Chatbot",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Business Plan",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Pitch Generator",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Legal Compliance",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
                                    ),
                                  )
                                ],
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              Get.offAll(() => Home(
                                    selectedIndex: 1,
                                  ));
                            },
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
                                    padding:
                                        const EdgeInsets.fromLTRB(5, 5, 5, 0),
                                    child: Text(
                                      "Manage Profile",
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w400,
                                          fontSize: 12),
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
                          "Trending News",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        InkWell(
                          onTap: () {
                            setState(() {
                              show_news = !show_news;
                            });
                          },
                          child: Container(
                              padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                              decoration: BoxDecoration(
                                  color: AppColors.primaryVariant,
                                  borderRadius: BorderRadius.circular(15)),
                              child: Icon(
                                show_news
                                    ? Icons.expand_less_rounded
                                    : Icons.expand_more_rounded,
                                size: 20,
                              )),
                        ),
                      ],
                    ),
                    show_news
                        ? Column(
                            children: [
                              Container(
                                height: 140,
                                width: double.infinity,
                                margin: EdgeInsets.only(top: 10),
                                padding:
                                    const EdgeInsets.fromLTRB(10, 10, 10, 10),
                                decoration: BoxDecoration(
                                    color: AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(15)),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Container(
                                        decoration: BoxDecoration(
                                            image: DecorationImage(
                                                image: NetworkImage(
                                                    "https://b2bblogassets.airtel.in/wp-content/uploads/2022/06/startup-company-scaled.jpg"),
                                                fit: BoxFit.cover),
                                            borderRadius:
                                                BorderRadius.circular(15)),
                                      ),
                                    ),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    Expanded(
                                      flex: 2,
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            "New Startup Launched",
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16),
                                          ),
                                          Divider(
                                            color: AppColors.grey,
                                            thickness: 0.8,
                                            height: 5,
                                          ),
                                          Expanded(
                                            child: Text(
                                                "The market demand for your product is high. You have a good chance of success.",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w400,
                                                    fontSize: 12)),
                                          ),
                                          SizedBox(
                                            height: 5,
                                          ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Container(
                                                decoration: BoxDecoration(
                                                    color: AppColors.white,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            15)),
                                                padding:
                                                    const EdgeInsets.fromLTRB(
                                                        8, 5, 8, 5),
                                                child: Text("CATEGORY",
                                                    style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontSize: 12,
                                                        color:
                                                            AppColors.black)),
                                              ),
                                              Text(
                                                DateFormat('EEE, d MMMM yyyy')
                                                    .format(DateTime.now()),
                                                style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                    color: AppColors.primary),
                                              ),
                                            ],
                                          )
                                        ],
                                      ),
                                    ),
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
                          "Metrics Breakdown",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
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
                                  padding:
                                      const EdgeInsets.fromLTRB(10, 10, 10, 10),
                                  decoration: BoxDecoration(
                                      color: AppColors.primaryVariant,
                                      borderRadius: BorderRadius.circular(15)),
                                  child: Container(
                                    decoration: BoxDecoration(
                                        color: AppColors.white,
                                        borderRadius:
                                            BorderRadius.circular(15)),
                                    child: PieChartWidget(values: [
                                      data['metrics']['market_demand']['score']
                                          .toDouble(),
                                      data['metrics']['feasibility']['score']
                                          .toDouble(),
                                      data['metrics']['scalability']['score']
                                          .toDouble(),
                                      data['metrics']['sustainability']['score']
                                          .toDouble()
                                    ], labels: [
                                      "Market Demand",
                                      "Feasibility",
                                      "Scalability",
                                      "Sustainability"
                                    ]),
                                  )),
                              MarketBreakdownCard(
                                  "Market Demand",
                                  "Market demand for the idea",
                                  data['metrics']['market_demand']['score'],
                                  data['metrics']['market_demand']
                                      ['explanation']),
                              MarketBreakdownCard(
                                  "Feasibility",
                                  "Feasibility of the idea",
                                  data['metrics']['feasibility']['score'],
                                  data['metrics']['feasibility']
                                      ['explanation']),
                              MarketBreakdownCard(
                                  "Scalability",
                                  "Scalability of the idea",
                                  data['metrics']['scalability']['score'],
                                  data['metrics']['scalability']
                                      ['explanation']),
                              MarketBreakdownCard(
                                  "Sustainability",
                                  "Sustainability of the idea",
                                  data['metrics']['sustainability']['score'],
                                  data['metrics']['sustainability']
                                      ['explanation']),
                              InfoCard(data['detailed_analysis'])
                            ],
                          )
                        : SizedBox(),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "SWOT Analysis",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
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
                            child: GridView(
                              physics: NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: 2,
                                      childAspectRatio: 1,
                                      mainAxisSpacing: 8,
                                      crossAxisSpacing: 8),
                              children: [
                                SWOTCard(
                                    "Strengths",
                                    "Strengths of the idea",
                                    data['swot']['strengths']
                                        .toString()
                                        .substring(
                                            1,
                                            data['swot']['strengths']
                                                    .toString()
                                                    .length -
                                                1)),
                                SWOTCard(
                                    "Weakness",
                                    "Weakness of the idea",
                                    data['swot']['weaknesses']
                                        .toString()
                                        .substring(
                                            1,
                                            data['swot']['weaknesses']
                                                    .toString()
                                                    .length -
                                                1)),
                                SWOTCard(
                                    "Opportunities",
                                    "Opportunities for the idea",
                                    data['swot']['opportunities']
                                        .toString()
                                        .substring(
                                            1,
                                            data['swot']['opportunities']
                                                    .toString()
                                                    .length -
                                                1)),
                                SWOTCard(
                                    "Threats",
                                    "Threats to the idea",
                                    data['swot']['threats']
                                        .toString()
                                        .substring(
                                            1,
                                            data['swot']['threats']
                                                    .toString()
                                                    .length -
                                                1)),
                              ],
                            ),
                          )
                        : SizedBox(),
                  ],
                ),
              );
  }

  Widget MarketBreakdownCard(
      String title, String subtitle, int score, String explanation) {
    return Container(
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
                    title,
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(subtitle,
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
                child: Text(score.toString() + "/10",
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
                color: score < 4
                    ? AppColors.redAccent
                    : score < 7
                        ? AppColors.yellowAccent
                        : AppColors.greenAccent,
                borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
            child: Text(explanation,
                style: TextStyle(fontWeight: FontWeight.w400, fontSize: 12)),
          )
        ],
      ),
    );
  }

  Widget InfoCard(String info) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.only(top: 10, bottom: 10),
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
      decoration: BoxDecoration(
          color: AppColors.primaryVariant,
          borderRadius: BorderRadius.circular(15)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                height: 40,
                width: 40,
                padding: const EdgeInsets.fromLTRB(8, 5, 8, 5),
                decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(15)),
                child: Icon(
                  Icons.info_outline_rounded,
                  color: AppColors.white,
                ),
              ),
              SizedBox(
                width: 10,
              ),
              Expanded(
                child: Text(info,
                    style:
                        TextStyle(fontWeight: FontWeight.w400, fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget SWOTCard(String title, String subtitle, String data) {
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
            title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          Text(subtitle,
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
              padding: const EdgeInsets.fromLTRB(8, 10, 8, 10),
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Text(data,
                        style: TextStyle(
                            fontWeight: FontWeight.w400, fontSize: 12)),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
