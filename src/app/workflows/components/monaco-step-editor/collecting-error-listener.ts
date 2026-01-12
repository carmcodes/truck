import {
  ANTLRErrorListener,
  RecognitionException,
  Recognizer,
  Token,
} from 'antlr4ts';

export interface AntlrError {
  line: number;
  column: number;
  message: string;
  offendingToken?: Token;
}

export class CollectingErrorListener implements ANTLRErrorListener<any> {
  errors: AntlrError[] = [];

  syntaxError(
    _recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | undefined
  ): void {
    this.errors.push({
      line,
      column: charPositionInLine,
      message: msg,
      offendingToken: offendingSymbol as Token,
    });
  }
}
