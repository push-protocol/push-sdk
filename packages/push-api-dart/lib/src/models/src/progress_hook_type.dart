// ignore_for_file: constant_identifier_names

enum ProgressLevel { INFO, SUCCESS, WARN, ERROR }

class ProgressHookType {
  final String progressId;
  final String progressTitle;
  final String progressInfo;
  final ProgressLevel level;

  ProgressHookType({
    required this.progressId,
    required this.progressTitle,
    required this.progressInfo,
    required this.level,
  });
}
