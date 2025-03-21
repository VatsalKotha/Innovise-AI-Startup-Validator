import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:innovise/formpage/constant_data.dart';

import '../common/colors.dart';

class Chat extends StatefulWidget {
  const Chat({Key? key}) : super(key: key);

  @override
  _ChatState createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  TextEditingController chatMessage = TextEditingController();
  List<Map<String, dynamic>> chatHistory = [];
  final Dio dio = Dio(); // Dio instance

  static String apiUrl = "${ConstantData.chat_url}";

  Future<void> sendMessage() async {
    if (chatMessage.text.isEmpty) return;

    String userMessage = chatMessage.text.trim();

    // Add user message to chat history
    setState(() {
      chatHistory.add({"sender": "user", "message": userMessage});
      chatMessage.clear();
    });

    try {
      var response = await dio.post(
        apiUrl,
        data: {"query": userMessage},
      );

      if (response.statusCode == 200) {
        String botResponse = response.data['advice'];

        // Add bot response to chat history
        setState(() {
          chatHistory.add({"sender": "bot", "message": botResponse});
        });
      } else {
        setState(() {
          chatHistory
              .add({"sender": "bot", "message": "Error fetching response."});
        });
      }
    } catch (e) {
      print(e);
      setState(() {
        chatHistory.add({
          "sender": "bot",
          "message": "Server unreachable. Please try again."
        });
      });
    }
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
                        'AI Chatbot',
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
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: chatHistory.length,
              itemBuilder: (context, index) {
                bool isUser = chatHistory[index]["sender"] == "user";
                return Align(
                  alignment:
                      isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color:
                          isUser ? AppColors.primary : AppColors.primaryVariant,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: MarkdownBody(
                      data: chatHistory[index]["message"],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.shade200,
                  spreadRadius: 5,
                  blurRadius: 5,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: chatMessage,
                    cursorColor: Colors.black,
                    decoration: const InputDecoration(
                      hintText: 'Enter your question...',
                      border: InputBorder.none,
                    ),
                  ),
                ),
                InkWell(
                  onTap: sendMessage,
                  child: Icon(Icons.send_rounded, color: AppColors.primary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
