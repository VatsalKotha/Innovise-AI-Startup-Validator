import 'package:flutter/material.dart';
import 'package:innovise/common/appbar.dart';
import 'package:innovise/dashboard/dashboard.dart';

import 'colors.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _selectedIndex = 0;

  List<Widget> _widgetOptions = <Widget>[Dashboard(), Dashboard()];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
          onPressed: () {},
          backgroundColor: AppColors.secondary,
          child: const Icon(
            Icons.chat_bubble_outline,
          )),
      backgroundColor: AppColors.white,
      appBar: Appbar(_getTitleForIndex(_selectedIndex)),
      body: Padding(
        padding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: AppColors.primaryVariant,
        indicatorColor: AppColors.secondary,
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  String _getTitleForIndex(int index) {
    switch (index) {
      case 0:
        return 'Dashboard';
      case 1:
        return 'My Profile';
      default:
        return '';
    }
  }
}
