import { ANTLRErrorListener, RecognitionException, Recognizer, Token } from 'antlr4ts';

export interface AntlrSyntaxError {
  line: number;       // 1-based
  column: number;     // 0-based (ANTLR)
  message: string;
  offendingToken?: Token;
}

export class CollectingErrorListener implements ANTLRErrorListener<any> {
  public errors: AntlrSyntaxError[] = [];

  syntaxError(
    _recognizer: Recognizer<any, any>,
    _offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | undefined
  ): void {
    this.errors.push({
      line,
      column: charPositionInLine,
      message: msg,
      offendingToken: _offendingSymbol as Token | undefined,
    });
  }
}
