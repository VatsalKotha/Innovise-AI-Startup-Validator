import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/auth/login.dart';
import 'package:innovise/formpage/form_main.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../common/colors.dart';
import '../formpage/constant_data.dart';

class MyProfile extends StatefulWidget {
  const MyProfile({super.key});

  @override
  State<MyProfile> createState() => _MyProfileState();
}

class _MyProfileState extends State<MyProfile> {
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
        '${ConstantData.server_url}/get_user/$uid',
      );

      if (response.statusCode == 200) {
        print(response.data['data']);
        data = response.data['data'];
        setState(() {});
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      Get.snackbar('Error', e.toString());
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: data == null
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 130,
                    padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                    decoration: BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.circular(20)),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SizedBox(
                                height: 10,
                              ),
                              Row(
                                children: [
                                  Icon(Icons.person_outline),
                                  const SizedBox(
                                    width: 5,
                                  ),
                                  Text(data!['name'],
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 16,
                                      )),
                                ],
                              ),
                              Row(
                                children: [
                                  Icon(Icons.email_outlined),
                                  const SizedBox(
                                    width: 5,
                                  ),
                                  Text(data!['email'],
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 16,
                                      )),
                                ],
                              ),
                              Expanded(child: SizedBox()),
                              Row(
                                children: [
                                  Text(
                                      DateFormat('dd-MMMM-yyyy, hh:mm a')
                                          .format(DateTime.parse(
                                              data!['date_of_join'])),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w300,
                                        fontSize: 12,
                                      )),
                                ],
                              ),
                              Row(
                                children: [
                                  Text(data!['uid'] ?? '',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w300,
                                        fontSize: 8,
                                      )),
                                ],
                              )
                            ],
                          ),
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              height: 70,
                              width: 70,
                              decoration: BoxDecoration(
                                color: AppColors.white,
                                borderRadius: BorderRadius.circular(35),
                              ),
                              child: Center(
                                child: Text(
                                  data != null &&
                                          data['name'].split(' ').length > 1
                                      ? data['name'].split('')[0] +
                                          data['name'].split(' ')[1][0]
                                      : data['name'][0],
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 24,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => Get.offAll(() => const FormMain()),
                          child: Container(
                            padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                            decoration: BoxDecoration(
                                color: AppColors.primaryVariant,
                                borderRadius: BorderRadius.circular(20)),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.edit_outlined),
                                SizedBox(
                                  width: 5,
                                ),
                                Text(
                                  'Edit Details',
                                  style: TextStyle(
                                      fontSize: 14,
                                      color: AppColors.black,
                                      fontWeight: FontWeight.bold,
                                      height: 0),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: InkWell(
                          onTap: () async {
                            SharedPreferences prefs =
                                await SharedPreferences.getInstance();
                            prefs.remove('uid');
                            Get.offAll(() => Login());
                            // await FirebaseAuth.instance
                            //     .signOut()
                            //     .then((value) {
                            //   Get.offAllNamed('/');
                            // });
                          },
                          child: Container(
                            margin: const EdgeInsets.only(left: 10),
                            padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                            decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(20)),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.power_settings_new_rounded,
                                  color: Colors.white,
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                Text(
                                  'Logout',
                                  style: TextStyle(
                                      fontSize: 14,
                                      color: AppColors.white,
                                      fontWeight: FontWeight.bold,
                                      height: 0),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Divider(
                    color: AppColors.grey,
                    thickness: 0.8,
                    height: 30,
                  ),
                  data!['is_data_filled'] == true
                      ? Text(
                          "Company Details",
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        )
                      : SizedBox(),
                  const SizedBox(
                    height: 10,
                  ),
                  data!['is_data_filled'] == true
                      ? Container(
                          padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                          decoration: BoxDecoration(
                              color: AppColors.primaryVariant,
                              borderRadius: BorderRadius.circular(20)),
                          child: Column(
                            children: [
                              detailWidget(
                                  'Startup Name', data!['startup_name']),
                              detailWidget(
                                  'Problem/Need', data!['problems_addressed']),
                              detailWidget('Unique Selling Proposition',
                                  data!['startup_unique_reasons']),
                              detailWidget(
                                  'Target Segment', data!['target_audiences']),
                              detailWidget(
                                  'Industry', data!['industry_operated']),
                              detailWidget(
                                  'Location', data!['startup_location']),
                              detailWidget('Team Size', data!['team_size']),
                              detailWidget('Founding Team Background',
                                  data!['founding_team_background']),
                              detailWidget('Stage', data!['stage']),
                              detailWidget(
                                  'Revenue Model', data!['revenue_model']),
                            ],
                          ),
                        )
                      : SizedBox(),
                  SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),
    );
  }

  Widget detailWidget(
    String title,
    value,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                title + ': ',
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
            Expanded(
              child: Text(
                value.toString().replaceAll('[', '').replaceAll(']', ''),
                style:
                    const TextStyle(fontWeight: FontWeight.w300, fontSize: 14),
              ),
            ),
          ],
        ),
        title == 'Revenue Model'
            ? SizedBox()
            : Divider(
                color: AppColors.primary,
                thickness: 0.8,
                height: 15,
              ),
      ],
    );
  }
}
