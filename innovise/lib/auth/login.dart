import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/auth/signup.dart';
import 'package:innovise/common/appbar.dart';
import 'package:innovise/common/colors.dart';
import 'package:innovise/common/home.dart';
import 'package:innovise/formpage/constant_data.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final formKey = GlobalKey<FormState>();
  final email = TextEditingController();
  final password = TextEditingController();
  bool showpassword = true;

  Future login() async {
    if (formKey.currentState!.validate()) {
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
        var response = await Dio().post(
          '${ConstantData.server_url}/login',
          data: {
            'email': email.text,
            'password': password.text,
          },
        );

        if (response.statusCode == 200) {
          String uid = response.data['uid'];
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString('uid', uid);

          Get.offAll(() => Home());
        } else {
          throw Exception('Login failed');
        }
      } catch (e) {
        Get.back();
        Get.snackbar('Error', e.toString());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Appbar("Login"),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 60),
          child: Form(
            key: formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Welcome to Innovise!",
                  style: TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 40, height: 1.2),
                ),
                const Divider(
                  color: AppColors.grey,
                  thickness: 1,
                ),
                const SizedBox(
                  height: 32,
                ),
                Text(
                  "Email",
                  style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w400),
                  textAlign: TextAlign.left,
                ),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: const BorderRadius.all(Radius.circular(8))),
                  child: TextFormField(
                    textInputAction: TextInputAction.next,
                    controller: email,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (input) {
                      if (GetUtils.isEmail(input!)) {
                        return null;
                      } else {
                        return "Enter a valid email";
                      }
                    },
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w500),
                    textAlign: TextAlign.left,
                    decoration: const InputDecoration(
                      hintText: "Enter Your Email ID.",
                      border: InputBorder.none,
                      prefixIconColor: Colors.black,
                      prefixIcon: Icon(
                        Icons.email,
                        size: 23,
                      ),
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                      isDense: true,
                    ),
                    onChanged: ((value) {}),
                  ),
                ),
                const SizedBox(
                  height: 15,
                ),
                Text(
                  "Password",
                  style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w400),
                  textAlign: TextAlign.left,
                ),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: const BorderRadius.all(Radius.circular(8))),
                  child: TextFormField(
                    textInputAction: TextInputAction.next,
                    controller: password,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (input) {
                      if (input!.isNotEmpty && input.length >= 8) {
                        return null;
                      } else {
                        return "Enter a valid password";
                      }
                    },
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w500),
                    textAlign: TextAlign.left,
                    decoration: InputDecoration(
                      hintText: "Enter Your Password",
                      border: InputBorder.none,
                      prefixIconColor: Colors.black,
                      prefixIcon: const Icon(Icons.lock, size: 23),
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      isDense: true,
                      suffixIcon: InkWell(
                        onTap: () {
                          setState(() {
                            showpassword = !showpassword;
                          });
                        },
                        child: Icon(
                          size: 23,
                          showpassword
                              ? Icons.visibility
                              : Icons.visibility_off,
                          color: Colors.black,
                        ),
                      ),
                    ),
                    obscureText: showpassword,
                    onChanged: ((value) {}),
                  ),
                ),
                // Row(
                //   mainAxisAlignment: MainAxisAlignment.end,
                //   children: [
                //     InkWell(
                //       onTap: () {
                //         // forgotPassword();
                //       },
                //       child: const Padding(
                //         padding: EdgeInsets.fromLTRB(0, 10, 0, 0),
                //         child: Text(
                //           "Forgot Password?",
                //           style: TextStyle(
                //               color: AppColors.primary,
                //               fontSize: 14,
                //               fontWeight: FontWeight.w600),
                //         ),
                //       ),
                //     ),
                //   ],
                // ),
                const SizedBox(
                  height: 30,
                ),
                InkWell(
                  onTap: () {
                    login();
                  },
                  child: Container(
                    height: 60,
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(18, 5, 18, 5),
                    decoration: const BoxDecoration(
                        color: AppColors.primaryVariant,
                        borderRadius: BorderRadius.all(Radius.circular(15))),
                    child: const Center(
                        child: Text(
                      "LOGIN",
                      style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.w600),
                    )),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Don't have an account?",
                      style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                          fontWeight: FontWeight.w300),
                    ),
                    InkWell(
                      onTap: () {
                        Get.offAll(() => const SignUp());
                      },
                      child: const Text(
                        " Sign Up",
                        style: TextStyle(
                            color: AppColors.primary,
                            fontSize: 14,
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 70,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
