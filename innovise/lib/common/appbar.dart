import 'package:flutter/material.dart';
import 'colors.dart';

class Appbar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  const Appbar(String this.title, {super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
        scrolledUnderElevation: 0,
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
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
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
                      title,
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
        ));
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}
