import 'package:auto_size_text_field/auto_size_text_field.dart';
import 'package:choice/choice.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:innovise/common/home.dart';
import 'package:innovise/formpage/constant_data.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../common/colors.dart';

class FormMain extends StatefulWidget {
  const FormMain({Key? key}) : super(key: key);

  @override
  _FormMainState createState() => _FormMainState();
}

class _FormMainState extends State<FormMain> {
  int current_page = 0;
  //Page 1 - Startup Name
  TextEditingController startup_name = TextEditingController();

  //Page 2 - Problems Addressed
  List<String> problems_addressed = [];

  //Page 3 - Startup Unique Reasons
  List<String> startup_unique_reasons = [];

  //Page 4 - Target Audience
  List<String> target_audiences = [];

  //Page 5 - Industry Operated
  var industry_operated = null;

  //Page 6 - Location
  TextEditingController startup_location = TextEditingController();

  //Page 7 - Team Size
  var team_size = null;

  //Page 8 - Founding Team Background
  List<String> founding_team_background = [];

  //Page 9 - Stage
  var stage = null;

  //Page 10 - Revenue Model
  List<String> revenue_model = [];

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

  Future<void> fetchLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    Position position = await Geolocator.getCurrentPosition();
    List<Placemark> placemarks =
        await placemarkFromCoordinates(position.latitude, position.longitude);
    startup_location.text = placemarks[0].locality!;
  }

  bool validateForm() {
    // Validation
    if (current_page == 0 && startup_name.text.isEmpty) {
      Get.snackbar('Error', 'Please enter the company name',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 1 && problems_addressed.isEmpty) {
      Get.snackbar('Error', 'Please select at least one problem addressed',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 2 && startup_unique_reasons.isEmpty) {
      Get.snackbar('Error', 'Please select at least one unique reason',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 3 && target_audiences.isEmpty) {
      Get.snackbar('Error', 'Please select the target audience(s)',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 4 && industry_operated == null) {
      Get.snackbar('Error', 'Please select the industry operated',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 5 && startup_location.text.isEmpty) {
      Get.snackbar('Error', 'Please enter the company location',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 6 && team_size == null) {
      Get.snackbar('Error', 'Please select the team size',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 7 && founding_team_background.isEmpty) {
      Get.snackbar(
          'Error', 'Please select at least one founding team background',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 8 && stage == null) {
      Get.snackbar('Error', 'Please select the stage of your company',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }
    if (current_page == 9 && revenue_model.isEmpty) {
      Get.snackbar('Error', 'Please select at least one revenue model',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
      return false;
    }

    return true;
  }

  Future submitForm() async {
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
      try {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        String? uid = prefs.getString('uid');

        if (uid == null) {
          throw Exception('User not logged in');
        }

        var response = await Dio().post(
          '${ConstantData.server_url}/update_user',
          data: {
            'uid': uid,
            'startup_name': startup_name.text,
            'problems_addressed': problems_addressed,
            'startup_unique_reasons': startup_unique_reasons,
            'target_audiences': target_audiences,
            'industry_operated': industry_operated,
            'startup_location': startup_location.text,
            'team_size': team_size,
            'founding_team_background': founding_team_background,
            'stage': stage,
            'revenue_model': revenue_model,
            'is_data_filled': true,
          },
        );

        if (response.statusCode == 200) {
          Get.snackbar('Success', 'User data updated successfully');
          Get.offAll(() => Home());
        } else {
          Get.back();
          throw Exception('Update failed');
        }
      } catch (e) {
        Get.snackbar('Error', e.toString());
        Get.back();
      }
      // await FirebaseFirestore.instance
      //     .collection('users')
      //     .doc(FirebaseAuth.instance.currentUser!.uid)
      //     .set({
      //   'Startup Name': startup_name.text,
      //   'ProblemNeed': problems_addressed,
      //   'Unique Selling Proposition': startup_unique_reasons,
      //   'Target Segment': target_audiences,
      //   'Industry': industry_operated,
      //   'Location': startup_location.text,
      //   'Team Size': team_size,
      //   'Founding Team Background': founding_team_background,
      //   'Stage': stage,
      //   'Revenue Model': revenue_model,
      //   "startup_data_filled": true
      // }, SetOptions(merge: true)).then((value) {
      //   Get.snackbar('Success', 'Data updated successfully',
      //       snackPosition: SnackPosition.BOTTOM,
      //       margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));

      //   Get.offAllNamed('/home');
      // });
    } catch (e) {
      Get.back();
      Get.snackbar('Error', 'An error occurred. Please try again later',
          snackPosition: SnackPosition.BOTTOM,
          margin: const EdgeInsets.only(bottom: 50, left: 20, right: 20));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 50, 20, 0),
          child: Column(
            children: [
              Text(
                ConstantData.questions[current_page],
                style: const TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 40, height: 1.2),
              ),
              const Divider(
                color: AppColors.grey,
                thickness: 1,
              ),
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(top: 8),
                decoration: BoxDecoration(
                    color: AppColors.primaryVariant,
                    borderRadius: BorderRadius.circular(15)),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const SizedBox(
                          width: 5,
                        ),
                        const Icon(Icons.lightbulb_outline_rounded),
                        const SizedBox(
                          width: 10,
                        ),
                        Expanded(
                          child: Text(
                            ConstantData.tips[current_page],
                            style: const TextStyle(
                                fontWeight: FontWeight.w500, fontSize: 15),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  //Page 1 - Startup Name
                  if (current_page == 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 100),
                      child: SizedBox(
                        child: Center(
                          child: AutoSizeTextField(
                            textAlign: TextAlign.center,
                            fullwidth: true,
                            onSubmitted: (value) {},
                            controller: startup_name,
                            style: const TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.w600,
                            ),
                            decoration: const InputDecoration(
                              hintText: 'Enter Company Name',
                              border: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: AppColors.grey,
                                ),
                              ),
                              hintStyle: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFCCCCCC)),
                            ),
                            minFontSize: 16,
                            maxFontSize: 26,
                            maxLines: 2,
                            minLines: 1,
                            textInputAction: TextInputAction.done,
                            onEditingComplete: () {},
                          ),
                        ),
                      ),
                    ),

                  //Page 2 - Problems Addressed
                  if (current_page == 1)
                    InlineChoice<String>.multiple(
                      clearable: true,
                      value: problems_addressed,
                      onChanged: (value) {
                        setState(() {
                          problems_addressed = value;
                        });
                      },
                      itemCount:
                          ConstantData.problems_addressed_choices.length + 1,
                      itemBuilder: (state, i) {
                        if (i ==
                            ConstantData.problems_addressed_choices.length) {
                          return ChoiceChip(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                            side: BorderSide.none,
                            selectedColor: AppColors.primary,
                            showCheckmark: false,
                            labelStyle: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                            backgroundColor: AppColors.primaryVariant,
                            selected: false,
                            onSelected: (_) async {
                              String? customValue =
                                  await _showCustomInputDialog(context);
                              if (customValue != null &&
                                  customValue.isNotEmpty) {
                                ConstantData.problems_addressed_choices
                                    .add(customValue);
                                problems_addressed.add(customValue);
                                setState(() {});
                              }
                            },
                            label: Text("+ Others"),
                          );
                        } else {
                          return ChoiceChip(
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15)),
                            side: BorderSide.none,
                            selectedColor: AppColors.primary,
                            showCheckmark: false,
                            labelStyle: TextStyle(
                                color: state.selected(ConstantData
                                        .problems_addressed_choices[i])
                                    ? AppColors.white
                                    : Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.w500),
                            backgroundColor: AppColors.primaryVariant,
                            selected: state.selected(
                                ConstantData.problems_addressed_choices[i]),
                            onSelected: state.onSelected(
                                ConstantData.problems_addressed_choices[i]),
                            label: Text(
                                ConstantData.problems_addressed_choices[i]),
                          );
                        }
                      },
                      listBuilder: ChoiceList.createWrapped(
                        spacing: 5,
                        runSpacing: 0,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 0,
                          vertical: 50,
                        ),
                      ),
                    ),

                  // Page 3 - Startup Unique Reasons
                  if (current_page == 2)
                    InlineChoice<String>.multiple(
                      clearable: true,
                      value: startup_unique_reasons,
                      onChanged: (value) {
                        setState(() {
                          startup_unique_reasons = value;
                        });
                      },
                      itemCount:
                          ConstantData.startup_unique_reasons_choices.length +
                              1, // +1 for "Others"
                      itemBuilder: (state, i) {
                        if (i ==
                            ConstantData
                                .startup_unique_reasons_choices.length) {
                          return ChoiceChip(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                            side: BorderSide.none,
                            selectedColor: AppColors.primary,
                            showCheckmark: false,
                            labelStyle: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                            backgroundColor: AppColors.primaryVariant,
                            selected: false,
                            onSelected: (_) async {
                              String? customValue =
                                  await _showCustomInputDialog(context);
                              if (customValue != null &&
                                  customValue.isNotEmpty) {
                                ConstantData.startup_unique_reasons_choices
                                    .add(customValue);
                                startup_unique_reasons.add(customValue);
                                setState(() {});
                              }
                            },
                            label: Text("+ Others"),
                          );
                        } else {
                          return ChoiceChip(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                            side: BorderSide.none,
                            selectedColor: AppColors.primary,
                            showCheckmark: false,
                            labelStyle: TextStyle(
                              color: state.selected(ConstantData
                                      .startup_unique_reasons_choices[i])
                                  ? AppColors.white
                                  : Colors.black,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                            backgroundColor: AppColors.primaryVariant,
                            selected: state.selected(
                                ConstantData.startup_unique_reasons_choices[i]),
                            onSelected: state.onSelected(
                                ConstantData.startup_unique_reasons_choices[i]),
                            label: Text(
                                ConstantData.startup_unique_reasons_choices[i]),
                          );
                        }
                      },
                      listBuilder: ChoiceList.createWrapped(
                        spacing: 5,
                        runSpacing: 0,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 0,
                          vertical: 50,
                        ),
                      ),
                    ),

                  //Page 4 - Target Audience
                  if (current_page == 3)
                    InlineChoice<String>.multiple(
                      clearable: true,
                      value: target_audiences,
                      onChanged: (value) {
                        setState(() {
                          target_audiences = value;
                        });
                      },
                      itemCount: ConstantData.target_audience_choices.length,
                      itemBuilder: (state, i) {
                        return InkWell(
                          onTap: () {
                            setState(() {
                              state.select(
                                  ConstantData.target_audience_choices[i]);
                            });
                          },
                          child: Container(
                            height: 100,
                            padding: const EdgeInsets.all(5),
                            decoration: BoxDecoration(
                                color: state.selected(
                                        ConstantData.target_audience_choices[i])
                                    ? AppColors.primary
                                    : AppColors.primaryVariant,
                                borderRadius: BorderRadius.circular(15)),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Image.asset(
                                  'assets/images/target_audience_${i + 1}.png',
                                  height: 45,
                                  fit: BoxFit.contain,
                                  color: state.selected(ConstantData
                                          .target_audience_choices[i])
                                      ? AppColors.white
                                      : AppColors.black,
                                ),
                                ConstantData.target_audience_choices[i]
                                        .contains('-')
                                    ? Column(
                                        children: [
                                          Text(
                                            ConstantData
                                                .target_audience_choices[i]
                                                .split(' - ')[0],
                                            style: TextStyle(
                                                color: state.selected(ConstantData
                                                        .target_audience_choices[i])
                                                    ? AppColors.white
                                                    : AppColors.black,
                                                fontSize: 14,
                                                fontWeight: FontWeight.w500),
                                          ),
                                          Text(
                                            ConstantData
                                                .target_audience_choices[i]
                                                .split(' - ')[1],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                                color: state.selected(ConstantData
                                                        .target_audience_choices[i])
                                                    ? AppColors.white
                                                    : AppColors.black,
                                                fontSize: 10,
                                                fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      )
                                    : Text(
                                        ConstantData.target_audience_choices[i],
                                        style: TextStyle(
                                            color: state.selected(ConstantData
                                                    .target_audience_choices[i])
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
                          vertical: 30,
                        ),
                      ),
                    ),

                  //Page 5 - Industry Operated
                  if (current_page == 4)
                    InlineChoice<String>.single(
                      clearable: true,
                      value: industry_operated,
                      onChanged: (value) {
                        setState(() {
                          industry_operated = value;
                        });
                      },
                      itemCount: ConstantData.industry_operated_choices.length,
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
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
                          vertical: 30,
                        ),
                      ),
                    ),

                  //Page 6 - Location
                  if (current_page == 5)
                    Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(top: 100, bottom: 25),
                          child: SizedBox(
                            child: Center(
                              child: AutoSizeTextField(
                                textAlign: TextAlign.center,
                                fullwidth: true,
                                onSubmitted: (value) {},
                                controller: startup_location,
                                style: const TextStyle(
                                  fontSize: 36,
                                  fontWeight: FontWeight.w600,
                                ),
                                decoration: const InputDecoration(
                                  hintText: 'Enter Company Location',
                                  border: UnderlineInputBorder(
                                    borderSide: BorderSide(
                                      color: AppColors.grey,
                                    ),
                                  ),
                                  hintStyle: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFFCCCCCC)),
                                ),
                                minFontSize: 16,
                                maxFontSize: 26,
                                maxLines: 2,
                                minLines: 1,
                                textInputAction: TextInputAction.done,
                                onEditingComplete: () {},
                              ),
                            ),
                          ),
                        ),
                        const Row(
                          children: [
                            Expanded(
                              child: Divider(
                                color: AppColors.grey,
                                thickness: 0.8,
                              ),
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            Text('OR',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 16)),
                            SizedBox(
                              width: 10,
                            ),
                            Expanded(
                              child: Divider(
                                color: AppColors.grey,
                                thickness: 0.8,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () {
                                fetchLocation();
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                    color: AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(40)),
                                margin: const EdgeInsets.only(top: 20),
                                padding:
                                    const EdgeInsets.fromLTRB(15, 10, 15, 10),
                                child: const Row(
                                  children: [
                                    Text(
                                      'Fetch Current Location',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15),
                                    ),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    Icon(Icons.location_searching_rounded),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),

                  //Page 7 - Team Size
                  if (current_page == 6)
                    Column(
                      children: [
                        const SizedBox(
                          height: 20,
                        ),
                        for (int i = 0;
                            i < ConstantData.team_size_choices.length;
                            i++)
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                team_size = ConstantData.team_size_choices[i];
                              });
                            },
                            child: Container(
                              margin: const EdgeInsets.only(top: 12),
                              width: double.infinity,
                              height: 40,
                              padding: const EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                  color: ConstantData.team_size_choices[i] ==
                                          team_size
                                      ? AppColors.primary
                                      : AppColors.primaryVariant,
                                  borderRadius: BorderRadius.circular(15)),
                              child: Center(
                                child: Text(
                                  ConstantData.team_size_choices[i],
                                  style: TextStyle(
                                      color:
                                          ConstantData.team_size_choices[i] ==
                                                  team_size
                                              ? AppColors.white
                                              : AppColors.black,
                                      fontSize: 18,
                                      fontWeight: FontWeight.w500),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),

                  // Page 8 - Founding Team Background
                  if (current_page == 7)
                    Column(
                      children: [
                        const SizedBox(height: 20),
                        for (int i = 0;
                            i < ConstantData.team_background_choices.length + 1;
                            i++)
                          GestureDetector(
                            onTap: () async {
                              if (i ==
                                  ConstantData.team_background_choices.length) {
                                // "Others" option for custom input
                                String? customValue =
                                    await _showCustomInputDialog(context);
                                if (customValue != null &&
                                    customValue.isNotEmpty) {
                                  setState(() {
                                    ConstantData.team_background_choices
                                        .add(customValue);
                                    founding_team_background.add(customValue);
                                  });
                                }
                              } else {
                                setState(() {
                                  if (founding_team_background.contains(
                                      ConstantData
                                          .team_background_choices[i])) {
                                    founding_team_background.remove(ConstantData
                                        .team_background_choices[i]);
                                  } else {
                                    founding_team_background.add(ConstantData
                                        .team_background_choices[i]);
                                  }
                                });
                              }
                            },
                            child: Container(
                              margin: const EdgeInsets.only(top: 12),
                              width: double.infinity,
                              height: 40,
                              padding: const EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                color: i ==
                                        ConstantData
                                            .team_background_choices.length
                                    ? AppColors
                                        .primaryVariant // Default color for "Others"
                                    : founding_team_background.contains(
                                            ConstantData
                                                .team_background_choices[i])
                                        ? AppColors.primary
                                        : AppColors.primaryVariant,
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: Center(
                                child: Text(
                                  i ==
                                          ConstantData
                                              .team_background_choices.length
                                      ? "+ Others" // Display "+ Others" for last option
                                      : ConstantData.team_background_choices[i],
                                  style: TextStyle(
                                    color: i ==
                                            ConstantData
                                                .team_background_choices.length
                                        ? Colors.black
                                        : founding_team_background.contains(
                                                ConstantData
                                                    .team_background_choices[i])
                                            ? AppColors.white
                                            : AppColors.black,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),

                  //Page 9 - Stage
                  if (current_page == 8)
                    InlineChoice<String>.single(
                      clearable: true,
                      value: stage,
                      onChanged: (value) {
                        setState(() {
                          stage = value;
                        });
                      },
                      itemCount: ConstantData.stage_choices.length,
                      itemBuilder: (state, i) {
                        return InkWell(
                          onTap: () {
                            setState(() {
                              state.select(ConstantData.stage_choices[i]);
                            });
                          },
                          child: Container(
                            height: 100,
                            padding: const EdgeInsets.all(5),
                            decoration: BoxDecoration(
                                color: state
                                        .selected(ConstantData.stage_choices[i])
                                    ? AppColors.primary
                                    : AppColors.primaryVariant,
                                borderRadius: BorderRadius.circular(15)),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Image.asset(
                                  'assets/images/stage_${i + 1}.png',
                                  height: 60,
                                  fit: BoxFit.contain,
                                  color: state.selected(
                                          ConstantData.stage_choices[i])
                                      ? AppColors.white
                                      : AppColors.black,
                                ),
                                ConstantData.stage_choices[i].contains('-')
                                    ? Column(
                                        children: [
                                          Text(
                                            ConstantData.stage_choices[i]
                                                .split(' - ')[0],
                                            style: TextStyle(
                                                color: state.selected(
                                                        ConstantData
                                                            .stage_choices[i])
                                                    ? AppColors.white
                                                    : AppColors.black,
                                                fontSize: 16,
                                                fontWeight: FontWeight.w500),
                                          ),
                                          Text(
                                            ConstantData.stage_choices[i]
                                                .split(' - ')[1],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                                color: state.selected(
                                                        ConstantData
                                                            .stage_choices[i])
                                                    ? AppColors.white
                                                    : AppColors.black,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      )
                                    : Text(
                                        ConstantData.stage_choices[i],
                                        style: TextStyle(
                                            color: state.selected(ConstantData
                                                    .stage_choices[i])
                                                ? AppColors.white
                                                : AppColors.black,
                                            fontSize: 16,
                                            fontWeight: FontWeight.w500),
                                      ),
                              ],
                            ),
                          ),
                        );
                      },
                      listBuilder: ChoiceList.createGrid(
                        columns: 2,
                        spacing: 12,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 0,
                          vertical: 25,
                        ),
                      ),
                    ),
                  // Page 10 - Revenue Model
                  if (current_page == 9)
                    Column(
                      children: [
                        const SizedBox(height: 20),
                        for (int i = 0;
                            i < ConstantData.revenue_model_choices.length + 1;
                            i++)
                          GestureDetector(
                            onTap: () async {
                              if (i ==
                                  ConstantData.revenue_model_choices.length) {
                                // "Others" option for custom input
                                String? customValue =
                                    await _showCustomInputDialog(context);
                                if (customValue != null &&
                                    customValue.isNotEmpty) {
                                  setState(() {
                                    ConstantData.revenue_model_choices
                                        .add(customValue);
                                    revenue_model.add(customValue);
                                  });
                                }
                              } else {
                                setState(() {
                                  if (revenue_model.contains(
                                      ConstantData.revenue_model_choices[i])) {
                                    revenue_model.remove(
                                        ConstantData.revenue_model_choices[i]);
                                  } else {
                                    revenue_model.add(
                                        ConstantData.revenue_model_choices[i]);
                                  }
                                });
                              }
                            },
                            child: Container(
                              margin: const EdgeInsets.only(top: 12),
                              width: double.infinity,
                              height: 40,
                              padding: const EdgeInsets.all(5),
                              decoration: BoxDecoration(
                                color: i ==
                                        ConstantData
                                            .revenue_model_choices.length
                                    ? AppColors
                                        .primaryVariant // Default color for "+ Others"
                                    : revenue_model.contains(ConstantData
                                            .revenue_model_choices[i])
                                        ? AppColors.primary
                                        : AppColors.primaryVariant,
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: Center(
                                child: Text(
                                  i == ConstantData.revenue_model_choices.length
                                      ? "+ Others" // Display "+ Others" for last option
                                      : ConstantData.revenue_model_choices[i],
                                  style: TextStyle(
                                    color: i ==
                                            ConstantData
                                                .revenue_model_choices.length
                                        ? Colors.black
                                        : revenue_model.contains(ConstantData
                                                .revenue_model_choices[i])
                                            ? AppColors.white
                                            : AppColors.black,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
      appBar: AppBar(
          backgroundColor: AppColors.white,
          title: Padding(
            padding: const EdgeInsets.all(5.0),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Innovise",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
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
                        ConstantData.appbar_titles[current_page],
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
      bottomNavigationBar: Stack(
        alignment: Alignment.topCenter,
        children: [
          Container(
            height: 70,
            margin: const EdgeInsets.only(top: 30),
            decoration: const BoxDecoration(
                color: AppColors.primaryVariant,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12))),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                current_page == 0
                    ? const SizedBox(
                        width: 100,
                      )
                    : InkWell(
                        onTap: () {
                          setState(() {
                            current_page--;
                          });
                        },
                        child: SizedBox(
                          width: 100,
                          child: Row(
                            children: [
                              Container(
                                height: 40,
                                width: 40,
                                decoration: BoxDecoration(
                                    color: AppColors.secondary,
                                    borderRadius: BorderRadius.circular(40)),
                                child: const Icon(
                                  Icons.chevron_left_rounded,
                                  color: AppColors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                Center(
                  child: Text(
                    '${current_page + 1}/10',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                        color: AppColors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.bold),
                  ),
                ),
                InkWell(
                  onTap: () {
                    setState(() {
                      if (validateForm() == false) {
                        return;
                      }

                      if (current_page == ConstantData.total_pages - 1) {
                        submitForm();
                        return;
                      }

                      current_page++;
                    });
                  },
                  child: SizedBox(
                    width: 100,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          height: 40,
                          padding: const EdgeInsets.only(left: 10, right: 5),
                          decoration: BoxDecoration(
                              color: AppColors.secondary,
                              borderRadius: BorderRadius.circular(40)),
                          child: current_page == ConstantData.total_pages - 1
                              ? const Row(
                                  children: [
                                    Padding(
                                      padding: EdgeInsets.only(right: 5),
                                      child: Text(
                                        'Done',
                                        style: TextStyle(
                                            color: AppColors.black,
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                )
                              : const Row(
                                  children: [
                                    Text(
                                      'Next',
                                      style: TextStyle(
                                          color: AppColors.black,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    Icon(
                                      Icons.chevron_right_outlined,
                                      color: AppColors.black,
                                    ),
                                  ],
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (int i = 0; i < ConstantData.total_pages; i++)
                Padding(
                  padding: const EdgeInsets.fromLTRB(0, 0, 4, 0),
                  child: CircleAvatar(
                    backgroundColor: i == current_page
                        ? AppColors.primary
                        : i < current_page
                            ? AppColors.secondary
                            : AppColors.primaryVariant,
                    radius: 5,
                  ),
                ),
            ],
          )
        ],
      ),
    );
  }
}
