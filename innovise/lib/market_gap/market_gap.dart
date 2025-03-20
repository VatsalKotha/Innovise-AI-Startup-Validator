import 'package:choice/choice.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:get/get.dart';

import '../common/appbar.dart';
import '../common/colors.dart';
import '../formpage/constant_data.dart';

class MarketGap extends StatefulWidget {
  const MarketGap({Key? key}) : super(key: key);

  @override
  _MarketGapState createState() => _MarketGapState();
}

class _MarketGapState extends State<MarketGap> {
  String? industry_operated;
  var data;

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
        '${ConstantData.market_gap_url}/analyze',
        data: {
          'industry': industry_operated,
        },
      );

      if (response.statusCode == 200) {
        print(response.data);
        data = response.data['insights'];
        Get.back();

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

  Future<String?> _showCustomInputDialog(BuildContext context) async {
    TextEditingController _controller = TextEditingController();

    return await Get.bottomSheet<String>(
      StatefulBuilder(
        builder: (context, setState) => Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          ),
          child: Container(
            height: 250,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Enter Custom Input",
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w400,
                  ),
                  textAlign: TextAlign.left,
                ),
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: const BorderRadius.all(Radius.circular(8)),
                  ),
                  child: TextField(
                    controller: _controller,
                    textInputAction: TextInputAction.done,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w500),
                    decoration: const InputDecoration(
                      hintText: "Type here...",
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(height: 30),
                InkWell(
                  onTap: () {
                    String inputText = _controller.text.trim();
                    Get.back(result: inputText.isNotEmpty ? inputText : null);
                  },
                  child: Container(
                    height: 60,
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(18, 5, 18, 5),
                    decoration: const BoxDecoration(
                      color: AppColors.primaryVariant,
                      borderRadius: BorderRadius.all(Radius.circular(15)),
                    ),
                    child: const Center(
                      child: Text(
                        "ADD",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      isDismissible: true,
      enableDrag: true,
    );
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
                          'Market Gap',
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
        body: Padding(
          padding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Market Gap Analysis",
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
                "Market gap analysis is the process of determining the difference between the potential market and the actual market for a product or service. It helps businesses identify opportunities for growth and expansion."),
            data == null
                ? Column(
                    children: [
                      InfoCard(
                          "Choose an industry to view the market gap analysis"),
                      InlineChoice<String>.single(
                        clearable: true,
                        value: industry_operated,
                        onChanged: (value) async {
                          if (value == "Others") {
                            String? customInput =
                                await _showCustomInputDialog(context);
                            if (customInput != null) {
                              industry_operated = customInput;
                              analyseData();
                            }
                          } else {
                            industry_operated = value;
                            analyseData();
                          }
                        },
                        itemCount:
                            ConstantData.industry_operated_choices.length,
                        itemBuilder: (state, i) {
                          return InkWell(
                            onTap: () {
                              setState(() {
                                state.select(
                                    ConstantData.industry_operated_choices[i]);
                              });
                            },
                            child: Container(
                              height: 100,
                              padding: const EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                  color: state.selected(ConstantData
                                          .industry_operated_choices[i])
                                      ? AppColors.primary
                                      : AppColors.primaryVariant,
                                  borderRadius: BorderRadius.circular(15)),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  Image.asset(
                                    'assets/images/industy_${i + 1}.png',
                                    height: 45,
                                    fit: BoxFit.contain,
                                    color: state.selected(ConstantData
                                            .industry_operated_choices[i])
                                        ? AppColors.white
                                        : AppColors.black,
                                  ),
                                  Text(
                                    ConstantData.industry_operated_choices[i],
                                    style: TextStyle(
                                        color: state.selected(ConstantData
                                                .industry_operated_choices[i])
                                            ? AppColors.white
                                            : AppColors.black,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        listBuilder: ChoiceList.createGrid(
                          columns: 3,
                          spacing: 10,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 0,
                            vertical: 10,
                          ),
                        ),
                      ),
                    ],
                  )
                : Expanded(
                    child: Container(
                        margin: const EdgeInsets.only(top: 10),
                        decoration: BoxDecoration(
                            color: AppColors.primaryVariant,
                            borderRadius: BorderRadius.circular(15)),
                        child: Markdown(data: data.toString())),
                  )
          ]),
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
