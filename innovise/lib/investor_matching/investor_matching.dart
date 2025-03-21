import 'package:choice/choice.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../common/appbar.dart';
import '../common/colors.dart';
import '../formpage/constant_data.dart';

class InvestorMatching extends StatefulWidget {
  const InvestorMatching({Key? key}) : super(key: key);

  @override
  _InvestorMatchingState createState() => _InvestorMatchingState();
}

class _InvestorMatchingState extends State<InvestorMatching> {
  var data;

  @override
  void initState() {
    fetchData(null);
    _getUserLocation();
    super.initState();
  }

  GoogleMapController? _mapController;
  LatLng? _currentLocation;

  Future<void> _getUserLocation() async {
    var status = await Permission.location.request();
    if (status.isGranted) {
      Position position = await Geolocator.getCurrentPosition();

      setState(() {
        _currentLocation = LatLng(position.latitude, position.longitude);
      });

      _mapController?.animateCamera(
        CameraUpdate.newLatLngZoom(_currentLocation!, 15),
      );
    } else {}
  }

  Future setLocation(double latitude, double longitude) async {
    setState(() {
      _currentLocation = LatLng(latitude, longitude);
    });

    _mapController?.animateCamera(
      CameraUpdate.newLatLng(
        _currentLocation!,
      ),
    );
  }

  Set<Marker> markers = {};

  Future fetchData(int? funding_needed) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? uid = prefs.getString('uid');

      if (uid == null) {
        throw Exception('User not logged in');
      }
      var response = await Dio().post(
        '${ConstantData.server_url}/match_investors',
        data: funding_needed == null
            ? {
                'uid': uid,
              }
            : {
                'uid': uid,
                'funding_needed': funding_needed,
              },
      );

      if (response.statusCode == 200) {
        print(response.data);
        data = response.data;

        for (var investor in data['matched_investors']) {
          markers.add(
            Marker(
              markerId: MarkerId(investor['investor_name']),
              position: LatLng(
                investor['latitude'],
                investor['longitude'],
              ),
              infoWindow: InfoWindow(
                title: investor['investor_name'],
                snippet: investor['focus_industry'],
              ),
            ),
          );
        }

        setState(() {});
      } else {
        throw Exception('Failed to fetch user data');
      }
    } catch (e) {
      print(e);
      return null;
    }
  }

  TextEditingController fundingController = TextEditingController();

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
                          'Investor Matching',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: AppColors.primary),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )),
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
          child: SingleChildScrollView(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Investor Matching",
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
              SizedBox(
                height: 10,
              ),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                margin: const EdgeInsets.fromLTRB(0, 0, 0, 10),
                decoration: BoxDecoration(
                    color: AppColors.primaryVariant,
                    borderRadius: const BorderRadius.all(Radius.circular(15))),
                child: Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: fundingController,
                        style: const TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w500),
                        textAlign: TextAlign.left,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: "Funding Amount",
                          border: InputBorder.none,
                          prefixIconColor: Colors.black,
                          // prefixIcon: Icon(
                          //   Icons.attach_money_outlined,
                          //   size: 23,
                          // ),
                          contentPadding: EdgeInsets.symmetric(vertical: 12),
                          isDense: true,
                        ),
                        onChanged: ((value) {}),
                      ),
                    ),
                    SizedBox(
                      width: 10,
                    ),
                    InkWell(
                      onTap: () {
                        fetchData(fundingController.text.isEmpty
                            ? null
                            : int.parse(fundingController.text));
                      },
                      child: Container(
                        padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                        decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(15)),
                        child: Icon(
                          Icons.chevron_right_outlined,
                          color: AppColors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              data == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Center(
                          child: Container(
                            height: 100,
                            width: 100,
                            decoration: BoxDecoration(
                                color: Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(10)),
                            child: const Center(
                              child: CircularProgressIndicator(),
                            ),
                          ),
                        ),
                      ],
                    )
                  : Column(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          child: SizedBox(
                            height: 200,
                            child: GoogleMap(
                              onMapCreated: (controller) =>
                                  _mapController = controller,
                              initialCameraPosition: CameraPosition(
                                target: _currentLocation ??
                                    LatLng(19.0760, 72.8777), // Default: Mumbai
                                zoom: 0,
                              ),
                              markers: markers,
                              myLocationEnabled: true,
                              myLocationButtonEnabled: true,
                            ),
                          ),
                        ),
                        ListView.builder(
                          scrollDirection: Axis.vertical,
                          itemCount: data['matched_investors'].length,
                          shrinkWrap: true,
                          itemBuilder: (context, index) {
                            return InkWell(
                              onTap: () {
                                setLocation(
                                    data['matched_investors'][index]
                                        ['latitude'],
                                    data['matched_investors'][index]
                                        ['longitude']);
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                    color: AppColors.primaryVariant,
                                    borderRadius: BorderRadius.circular(15)),
                                margin: const EdgeInsets.only(top: 10),
                                padding:
                                    const EdgeInsets.fromLTRB(10, 10, 10, 10),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      data['matched_investors'][index]
                                          ['investor_name'],
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16),
                                    ),
                                    Divider(
                                      color: AppColors.grey,
                                      thickness: 0.8,
                                      height: 5,
                                    ),
                                    Row(
                                      children: [
                                        Container(
                                          margin: const EdgeInsets.only(
                                              top: 5, bottom: 2, right: 5),
                                          padding:
                                              EdgeInsets.fromLTRB(5, 2, 5, 2),
                                          decoration: BoxDecoration(
                                              color: AppColors.white,
                                              borderRadius:
                                                  BorderRadius.circular(15)),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.business_center_outlined,
                                                size: 14,
                                                color: AppColors.primary,
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "Focus: ",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.primary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            data['matched_investors'][index]
                                                ['focus_industry'],
                                            textAlign: TextAlign.left,
                                            style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      children: [
                                        Container(
                                          margin: const EdgeInsets.only(
                                              top: 5, bottom: 2, right: 5),
                                          padding:
                                              EdgeInsets.fromLTRB(5, 2, 5, 2),
                                          decoration: BoxDecoration(
                                              color: AppColors.white,
                                              borderRadius:
                                                  BorderRadius.circular(15)),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.location_on_outlined,
                                                size: 14,
                                                color: AppColors.primary,
                                              ),
                                              SizedBox(
                                                width: 5,
                                              ),
                                              Text(
                                                "Location: ",
                                                style: TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.primary,
                                                    fontSize: 12),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Text(
                                            data['matched_investors'][index]
                                                ['location'],
                                            textAlign: TextAlign.left,
                                            style: TextStyle(
                                                fontWeight: FontWeight.w400,
                                                fontSize: 12),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Container(
                                            decoration: BoxDecoration(
                                                color: AppColors.white,
                                                borderRadius:
                                                    BorderRadius.circular(15)),
                                            padding: const EdgeInsets.fromLTRB(
                                                10, 5, 10, 5),
                                            child: Column(
                                              children: [
                                                Text(
                                                  "Max Investment",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: AppColors.primary,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                Text(
                                                  NumberFormat.simpleCurrency()
                                                      .format(
                                                          data['matched_investors']
                                                                  [index][
                                                              'max_investment']),
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontSize: 12),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Container(
                                            margin:
                                                const EdgeInsets.only(left: 8),
                                            decoration: BoxDecoration(
                                                color: AppColors.white,
                                                borderRadius:
                                                    BorderRadius.circular(15)),
                                            padding: const EdgeInsets.fromLTRB(
                                                10, 5, 10, 5),
                                            child: Column(
                                              children: [
                                                Text(
                                                  "Confidence",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: AppColors.primary,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                Text(
                                                  data['matched_investors']
                                                              [index]
                                                          ['confidence_score']
                                                      .toString(),
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontSize: 12),
                                                ),
                                              ],
                                            ),
                                          ),
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    )
            ]),
          ),
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
