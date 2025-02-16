import '/components/app_bar_widget.dart';
import '/components/navbar_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:math';
import 'dart:ui';
import 'pending_widget.dart' show PendingWidget;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class PendingModel extends FlutterFlowModel<PendingWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for AppBar component.
  late AppBarModel appBarModel1;
  // Model for Navbar component.
  late NavbarModel navbarModel;
  // Model for AppBar component.
  late AppBarModel appBarModel2;

  @override
  void initState(BuildContext context) {
    appBarModel1 = createModel(context, () => AppBarModel());
    navbarModel = createModel(context, () => NavbarModel());
    appBarModel2 = createModel(context, () => AppBarModel());
  }

  @override
  void dispose() {
    appBarModel1.dispose();
    navbarModel.dispose();
    appBarModel2.dispose();
  }
}
