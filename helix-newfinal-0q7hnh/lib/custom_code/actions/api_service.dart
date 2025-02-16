import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // Get Stanford Hospital Dashboard Data
  static Future<Map<String, dynamic>> getStanfordDashboard() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/inventory/stanford/dashboard'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['data'];
      }
      throw Exception('Failed to load dashboard data');
    } catch (e) {
      throw Exception('Error connecting to server: $e');
    }
  }

  // Check Drug Availability
  static Future<Map<String, dynamic>> checkDrugAvailability(String drugName) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/inventory/stanford/check/${Uri.encodeComponent(drugName)}')
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'available': data['available'],
          'message': data['available'] ? 'Drug is available' : 'Drug is not available'
        };
      }
      throw Exception('Failed to check drug availability');
    } catch (e) {
      return {
        'success': false,
        'available': false,
        'message': 'Error checking availability: $e'
      };
    }
  }

  // Search Other Hospitals
  static Future<List<Map<String, dynamic>>> searchOtherHospitals(String drugName) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/inventory/search/other-hospitals/${Uri.encodeComponent(drugName)}')
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['results']);
      }
      throw Exception('Failed to search other hospitals');
    } catch (e) {
      throw Exception('Error searching hospitals: $e');
    }
  }
} 