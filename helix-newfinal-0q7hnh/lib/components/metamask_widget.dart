import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'metamask_model.dart';
export 'metamask_model.dart';

/// metamask
class MetamaskWidget extends StatefulWidget {
  const MetamaskWidget({super.key});

  @override
  State<MetamaskWidget> createState() => _MetamaskWidgetState();
}

class _MetamaskWidgetState extends State<MetamaskWidget> {
  late MetamaskModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MetamaskModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Icon(
      FFIcons.knotification,
      color: Colors.white,
      size: 20.0,
    );
  }
}
