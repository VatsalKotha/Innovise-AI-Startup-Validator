import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/auth/login.dart';
import 'package:innovise/auth/onboarding.dart';
import 'package:innovise/common/home.dart';
import 'package:innovise/formpage/constant_data.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'common/colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Innovise',
      theme: ThemeData(
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        scaffoldBackgroundColor: AppColors.white,
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
      transitionDuration: const Duration(milliseconds: 1000),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    pingApi();

    Future.delayed(const Duration(seconds: 3), () {
      checkLogin();
    });
  }

  Future pingApi() async {
    Dio dio = Dio();
    try {
      await dio.get(ConstantData.server_url);
      await dio.get(ConstantData.ai_url);
    } catch (e) {
      print(e);
    }
  }

  Future checkLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String token = prefs.getString('uid') ?? '';
    Future.delayed(const Duration(seconds: 3), () {
      if (token.isNotEmpty) {
        Get.offAll(() => Home());
      } else {
        Get.offAll(() => const Login());
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Container(
        child: Column(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.only(top: 20, bottom: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
                          decoration: BoxDecoration(
                            color: AppColors.primaryVariant.withOpacity(0.7),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            'Innovise',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 48,
                                color: AppColors.black,
                                fontWeight: FontWeight.bold,
                                height: 0),
                          ),
                        ),
                      ],
                    ),
                    const Column(
                      children: [
                        CircularProgressIndicator(
                          color: AppColors.primary,
                        ),
                        SizedBox(
                          height: 50,
                        ),
                        Text('''2024-25. DJSCE BTECH/CS - IPD/G3''',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 12,
                                color: AppColors.black,
                                fontWeight: FontWeight.bold,
                                height: 0)),
                        Text('Jeel Doshi, Meet Chavan, Vatsal Kotha, Mit Shah',
                            style: TextStyle(
                                fontSize: 10,
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                                height: 0)),
                        SizedBox(
                          height: 20,
                        )
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
