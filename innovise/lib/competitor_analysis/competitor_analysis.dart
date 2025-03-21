import 'package:choice/choice.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../common/appbar.dart';
import '../common/colors.dart';
import '../formpage/constant_data.dart';

class CompetitorAnalysis extends StatefulWidget {
  const CompetitorAnalysis({Key? key}) : super(key: key);

  @override
  _CompetitorAnalysisState createState() => _CompetitorAnalysisState();
}

class _CompetitorAnalysisState extends State<CompetitorAnalysis> {
  var data;

  @override
  void initState() {
    fetchData();
    super.initState();
  }

  Future fetchData() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? uid = prefs.getString('uid');

      if (uid == null) {
        throw Exception('User not logged in');
      }
      var response = await Dio().post(
        '${ConstantData.server_url}/analyze_competitors',
        data: {
          'uid': uid,
        },
      );

      if (response.statusCode == 200) {
        print(response.data);
        data = response.data;

        setState(() {});
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      print(e);
      return null;
    }
  }

  TextEditingController fundingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            scrolledUnderElevation: 0,
            backgroundColor: AppColors.white,
            centerTitle: true,
            actions: [
              SizedBox(
                width: 50,
              )
            ],
            title: Padding(
              padding: const EdgeInsets.all(5.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Text(
                        "Innovise",
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 24),
                      ),
                      const SizedBox(
                        height: 2,
                      ),
                      Container(
                        padding: const EdgeInsets.fromLTRB(7, 2, 7, 2),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Text(
                          'Competitor Analysis',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: AppColors.primary),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )),
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
          child: SingleChildScrollView(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Competitor Analysis",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
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
              InfoCard(
                  "Analyze competitors' with similarity scores. Identify overlaps and gaps to refine your strategy and stand out in the market."),
              data == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Center(
                          child: Container(
                            margin: EdgeInsets.only(top: 50),
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
                  : Column(
                      children: [
                        ListView.builder(
                          scrollDirection: Axis.vertical,
                          itemCount: data['similar_startups'].length,
                          shrinkWrap: true,
                          itemBuilder: (context, index) {
                            return InkWell(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                    color: AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(15)),
                                margin: const EdgeInsets.only(top: 10),
                                padding:
                                    const EdgeInsets.fromLTRB(10, 10, 10, 10),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      data['similar_startups'][index]
                                          ['startup_name'],
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16),
                                    ),
                                    Divider(
                                      color: AppColors.grey,
                                      thickness: 0.8,
                                      height: 5,
                                    ),
                                    Row(
                                      children: [
                                        Container(
                                          margin: const EdgeInsets.only(
                                              top: 5, bottom: 2, right: 5),
                                          padding:
                                              EdgeInsets.fromLTRB(5, 2, 5, 2),
                                          decoration: BoxDecoration(
                                              color: AppColors.white,
                                              borderRadius:
                                                  BorderRadius.circular(15)),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.business_center_outlined,
                                                size: 14,
                                                color: AppColors.primary,
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "Industry: ",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.primary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            data['similar_startups'][index]
                                                ['industry'],
                                            textAlign: TextAlign.left,
                                            style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      children: [
                                        Container(
                                          margin: const EdgeInsets.only(
                                              top: 5, bottom: 2, right: 5),
                                          padding:
                                              EdgeInsets.fromLTRB(5, 2, 5, 2),
                                          decoration: BoxDecoration(
                                              color: AppColors.white,
                                              borderRadius:
                                                  BorderRadius.circular(15)),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.data_usage_sharp,
                                                size: 14,
                                                color: AppColors.primary,
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "Target Segment: ",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.primary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            data['similar_startups'][index]
                                                ['target_segment'],
                                            textAlign: TextAlign.left,
                                            style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Container(
                                          margin: const EdgeInsets.only(
                                              top: 5, bottom: 2, right: 5),
                                          padding:
                                              EdgeInsets.fromLTRB(5, 2, 5, 2),
                                          decoration: BoxDecoration(
                                              color: AppColors.white,
                                              borderRadius:
                                                  BorderRadius.circular(15)),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.location_on_outlined,
                                                size: 14,
                                                color: AppColors.primary,
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "USPs: ",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.primary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            data['similar_startups'][index]
                                                ['usp'],
                                            textAlign: TextAlign.left,
                                            style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Container(
                                            margin:
                                                const EdgeInsets.only(left: 8),
                                            decoration: BoxDecoration(
                                                color: AppColors.white,
                                                borderRadius:
                                                    BorderRadius.circular(15)),
                                            padding: const EdgeInsets.fromLTRB(
                                                10, 5, 10, 5),
                                            child: Column(
                                              children: [
                                                Text(
                                                  "Similarity",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: AppColors.primary,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                Text(
                                                  (data['similar_startups']
                                                                      [index][
                                                                  'similarity_score'] *
                                                              100)
                                                          .toString()
                                                          .substring(0, 5) +
                                                      '%',
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontSize: 12),
                                                ),
                                              ],
                                            ),
                                          ),
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    )
            ]),
          ),
        ));
  }

  Widget InfoCard(String info) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.only(top: 10, bottom: 0),
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
}
