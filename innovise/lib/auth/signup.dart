import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:innovise/auth/login.dart';
import 'package:innovise/common/colors.dart';

import '../common/appbar.dart';

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => _LoginState();
}

class _LoginState extends State<SignUp> {
  final formKey = GlobalKey<FormState>();
  final username = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  bool showpassword = true;

  Future signup() async {
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
        //todo
      } catch (e) {
        Get.back();
        Get.snackbar('Error', e.toString());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const Appbar("Sign Up"),
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
                  "Get Started with Innovise!",
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
                  "Name",
                  style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w400),
                  textAlign: TextAlign.left,
                ),
                Container(
                  // height: 60,
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                  margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: const BorderRadius.all(Radius.circular(8))),
                  child: Center(
                    child: TextFormField(
                      textInputAction: TextInputAction.next,
                      controller: username,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      validator: (input) {
                        if (input!.isNotEmpty) {
                          return null;
                        } else {
                          return "Enter a valid name";
                        }
                      },
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w500),
                      textAlign: TextAlign.left,
                      decoration: const InputDecoration(
                        hintText: "Enter Your Name",
                        border: InputBorder.none,
                        prefixIconColor: Colors.black,
                        prefixIcon: Icon(
                          Icons.person,
                          size: 23,
                        ),
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                        isDense: true,
                      ),
                      onChanged: ((value) {}),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 15,
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
                      color: Colors.grey.shade50,
                      borderRadius: const BorderRadius.all(Radius.circular(8))),
                  child: Center(
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
                      color: Colors.grey.shade50,
                      borderRadius: const BorderRadius.all(Radius.circular(8))),
                  child: TextFormField(
                    textInputAction: TextInputAction.next,
                    controller: password,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    validator: (input) {
                      if (input!.isNotEmpty && input.length >= 8) {
                        return null;
                      } else {
                        return "Create a valid password of minimum 8 characters";
                      }
                    },
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w500),
                    textAlign: TextAlign.left,
                    decoration: InputDecoration(
                      hintText: "Enter Your Password",
                      border: InputBorder.none,
                      prefixIconColor: Colors.black,
                      prefixIcon: const Icon(
                        Icons.lock,
                        size: 23,
                      ),
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
                const SizedBox(
                  height: 30,
                ),
                InkWell(
                  onTap: () {
                    signup();
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
                      "REGISTER",
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
                      "Already have an account?",
                      style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                          fontWeight: FontWeight.w300),
                    ),
                    InkWell(
                      onTap: () {
                        Get.offAll(() => const Login());
                      },
                      child: const Text(
                        " Login",
                        style: TextStyle(
                            color: AppColors.primary,
                            fontSize: 14,
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 30,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
