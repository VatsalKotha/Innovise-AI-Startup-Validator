import 'package:choice/choice.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:innovise/common/colors.dart';
import 'package:innovise/formpage/constant_data.dart';
import 'package:innovise/pathway/flowchart.dart';

class Pathway extends StatefulWidget {
  const Pathway({Key? key}) : super(key: key);

  @override
  _PathwayState createState() => _PathwayState();
}

class _PathwayState extends State<Pathway> {
  String? industry_operated;
  String? chosen_pathway = ConstantData.pathway_aspects[0]['title'];
  Map chosen_pathway_map = ConstantData.pathway_aspects[0];
  TextEditingController pathwayController = TextEditingController();

  List<Map<String, dynamic>>? nodes;
  List<Map<String, dynamic>>? edges;

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

      var response = await Dio().post(
        '${ConstantData.business_pathway_url}',
        data: {
          'user_input': pathwayController.text,
          'focus_area': chosen_pathway,
        },
      );

      if (response.statusCode == 200) {
        print(response.data);
        Get.back();
        nodes = List<Map<String, dynamic>>.from(response.data['nodes']);
        edges = List<Map<String, dynamic>>.from(response.data['edges']);
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
                          'Pathway',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: AppColors.primary),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            )),
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 15, 20, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Business Plan",
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
            ),
            nodes != null && edges != null
                ? Column(
                    children: [
                      Container(
                        height: 1000,
                        child: FlowChartScreen(
                          nodes!,
                          edges!,
                        ),
                      ),
                    ],
                  )
                : Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InfoCard(
                            "Get a clear understanding of the business plan and the pathway to success. Generate a plan based on your business scenario."),
                        SizedBox(
                          height: 20,
                        ),
                        Text(
                          "Business Scenario",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        InlineChoice<String>.single(
                          clearable: true,
                          value: industry_operated,
                          onChanged: (value) async {
                            industry_operated = value;
                          },
                          itemCount:
                              ConstantData.sample_business_scenarios.length,
                          itemBuilder: (state, i) {
                            return InkWell(
                              onTap: () {
                                setState(() {
                                  pathwayController.text = ConstantData
                                      .sample_business_scenarios_prompt[i];
                                  state.select(ConstantData
                                      .sample_business_scenarios[i]);
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                    color: state.selected(ConstantData
                                            .sample_business_scenarios[i])
                                        ? AppColors.primary
                                        : AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(10)),
                                child: Center(
                                  child: Text(
                                    ConstantData.sample_business_scenarios[i],
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: state.selected(ConstantData
                                                .sample_business_scenarios[i])
                                            ? AppColors.white
                                            : AppColors.black,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500),
                                  ),
                                ),
                              ),
                            );
                          },
                          listBuilder: ChoiceList.createScrollable(
                            spacing: 10,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 0,
                              vertical: 10,
                            ),
                          ),
                        ),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
                          margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                          decoration: BoxDecoration(
                              color: AppColors.primaryVariant,
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(15))),
                          child: TextFormField(
                            controller: pathwayController,
                            maxLines: 6,
                            style: const TextStyle(
                                fontSize: 14, fontWeight: FontWeight.w500),
                            textAlign: TextAlign.left,
                            decoration: const InputDecoration(
                              hintText:
                                  "Choose a scenario or type your own ...",
                              hintStyle: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                              border: InputBorder.none,
                              prefixIconColor: Colors.black,
                              // prefixIcon: Icon(
                              //   Icons.attach_money_outlined,
                              //   size: 23,
                              // ),
                              contentPadding:
                                  EdgeInsets.symmetric(vertical: 12),
                              isDense: true,
                            ),
                            onChanged: ((value) {}),
                          ),
                        ),
                        Divider(
                          color: AppColors.grey,
                          thickness: 0.8,
                        ),
                        InlineChoice<String>.single(
                          clearable: true,
                          value: chosen_pathway,
                          onChanged: (value) async {
                            chosen_pathway_map = ConstantData.pathway_aspects
                                .firstWhere((element) =>
                                    element['title'] == value.toString());
                            chosen_pathway = value;
                          },
                          itemCount: ConstantData.pathway_aspects.length,
                          itemBuilder: (state, i) {
                            return InkWell(
                              onTap: () {
                                setState(() {
                                  state.select(
                                      ConstantData.pathway_aspects[i]['title']);
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                    color: state.selected(ConstantData
                                            .pathway_aspects[i]['title'])
                                        ? AppColors.primary
                                        : AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(10)),
                                child: Center(
                                  child: Text(
                                    ConstantData.pathway_aspects[i]['title'],
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: state.selected(ConstantData
                                                .pathway_aspects[i]['title'])
                                            ? AppColors.white
                                            : AppColors.black,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500),
                                  ),
                                ),
                              ),
                            );
                          },
                          listBuilder: ChoiceList.createScrollable(
                            spacing: 10,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 0,
                              vertical: 10,
                            ),
                          ),
                        ),
                        Container(
                            width: double.infinity,
                            padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                            margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                            decoration: BoxDecoration(
                                color: AppColors.primaryVariant,
                                borderRadius: const BorderRadius.all(
                                    Radius.circular(15))),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(chosen_pathway_map['title'],
                                    style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600)),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(chosen_pathway_map['description'],
                                    style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w400)),
                                SizedBox(
                                  height: 20,
                                ),
                                Text("Benefits:",
                                    style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600)),
                                for (var benefit
                                    in chosen_pathway_map['benefits'])
                                  Text(benefit,
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w400)),
                                SizedBox(
                                  height: 20,
                                ),
                                Text("Considerations:",
                                    style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600)),
                                for (var benefit
                                    in chosen_pathway_map['considerations'])
                                  Text(benefit,
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w400)),
                              ],
                            )),
                        SizedBox(
                          height: 20,
                        ),
                        InkWell(
                          onTap: () {
                            analyseData();
                          },
                          child: Container(
                            height: 60,
                            width: double.infinity,
                            padding: const EdgeInsets.fromLTRB(18, 5, 18, 5),
                            decoration: const BoxDecoration(
                                color: AppColors.primary,
                                borderRadius:
                                    BorderRadius.all(Radius.circular(15))),
                            child: const Center(
                                child: Text(
                              "Generate Business Pathway",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600),
                            )),
                          ),
                        ),
                      ],
                    ),
                  )
          ]),
        ));
  }

  Widget InfoCard(String info) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.only(top: 20, bottom: 0),
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
