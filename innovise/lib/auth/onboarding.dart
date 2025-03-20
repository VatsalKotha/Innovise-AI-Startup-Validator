import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/common/appbar.dart';
import 'package:innovise/common/colors.dart';
import 'package:innovise/common/home.dart';

class Onboarding extends StatefulWidget {
  const Onboarding({Key? key}) : super(key: key);

  @override
  _OnboardingState createState() => _OnboardingState();
}

class _OnboardingState extends State<Onboarding> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Padding(
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 60),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Column(
              children: [
                Row(
                  children: [
                    const Text(
                      'Hello,',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(left: 5),
                      padding: const EdgeInsets.fromLTRB(8, 2, 8, 2),
                      decoration: BoxDecoration(
                          color: AppColors.primaryVariant,
                          borderRadius: BorderRadius.circular(40)),
                      child: const Text(
                        "user!",
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 24,
                            color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
                const Divider(
                  color: AppColors.grey,
                  thickness: 1,
                ),
                const SizedBox(
                  height: 40,
                ),
              ],
            ),
            Expanded(
              child: Column(
                children: [
                  const Text(
                    'Welcome to Innovise!',
                    style: TextStyle(
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
                    child: const Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'In order to customise your experience and to provide you tailor-made reports, we need to know about your company.',
                                style: TextStyle(
                                    fontWeight: FontWeight.w500, fontSize: 15),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            //
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: () {},
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
                const SizedBox(
                  height: 20,
                ),
                InkWell(
                  onTap: () {
                    Get.offAll(() => const Home());
                  },
                  child: Text("I will do it later",
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.grey.shade500)),
                ),
              ],
            ),
          ],
        ),
      ),
      appBar: const Appbar("Welcome"),
    );
  }
}
