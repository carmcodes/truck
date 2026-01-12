// Generated from src/antlr/Language.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { LanguageVisitor } from "./LanguageVisitor";


export class LanguageParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly NEWLINE = 22;
	public static readonly WHILE = 23;
	public static readonly INTEGER = 24;
	public static readonly FLOAT = 25;
	public static readonly STRING = 26;
	public static readonly BOOL = 27;
	public static readonly NULL = 28;
	public static readonly WS = 29;
	public static readonly IDENTIFIER = 30;
	public static readonly RULE_program = 0;
	public static readonly RULE_line = 1;
	public static readonly RULE_statement = 2;
	public static readonly RULE_ifBlock = 3;
	public static readonly RULE_elseIfBlock = 4;
	public static readonly RULE_whileBlock = 5;
	public static readonly RULE_assignment = 6;
	public static readonly RULE_functionCall = 7;
	public static readonly RULE_expression = 8;
	public static readonly RULE_multOp = 9;
	public static readonly RULE_addOp = 10;
	public static readonly RULE_compareOp = 11;
	public static readonly RULE_boolOp = 12;
	public static readonly RULE_constant = 13;
	public static readonly RULE_block = 14;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "line", "statement", "ifBlock", "elseIfBlock", "whileBlock", 
		"assignment", "functionCall", "expression", "multOp", "addOp", "compareOp", 
		"boolOp", "constant", "block",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'if'", "'else'", "'='", "'('", "','", "')'", "'!'", "'*'", 
		"'/'", "'+'", "'-'", "'=='", "'!='", "'>'", "'<'", "'>='", "'<='", "'and'", 
		"'or'", "'{'", "'}'", "'\rn'", "'while'", undefined, undefined, undefined, 
		undefined, "'null'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, "NEWLINE", "WHILE", "INTEGER", "FLOAT", "STRING", "BOOL", "NULL", 
		"WS", "IDENTIFIER",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(LanguageParser._LITERAL_NAMES, LanguageParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return LanguageParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Language.g4"; }

	// @Override
	public get ruleNames(): string[] { return LanguageParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return LanguageParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(LanguageParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, LanguageParser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 33;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << LanguageParser.T__0) | (1 << LanguageParser.WHILE) | (1 << LanguageParser.IDENTIFIER))) !== 0)) {
				{
				{
				this.state = 30;
				this.line();
				}
				}
				this.state = 35;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 36;
			this.match(LanguageParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public line(): LineContext {
		let _localctx: LineContext = new LineContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, LanguageParser.RULE_line);
		try {
			this.state = 41;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case LanguageParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 38;
				this.statement();
				}
				break;
			case LanguageParser.T__0:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 39;
				this.ifBlock();
				}
				break;
			case LanguageParser.WHILE:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 40;
				this.whileBlock();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, LanguageParser.RULE_statement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 45;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				{
				this.state = 43;
				this.assignment();
				}
				break;

			case 2:
				{
				this.state = 44;
				this.functionCall();
				}
				break;
			}
			this.state = 47;
			this.match(LanguageParser.NEWLINE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ifBlock(): IfBlockContext {
		let _localctx: IfBlockContext = new IfBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, LanguageParser.RULE_ifBlock);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 49;
			this.match(LanguageParser.T__0);
			this.state = 50;
			this.expression(0);
			this.state = 51;
			this.block();
			this.state = 54;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === LanguageParser.T__1) {
				{
				this.state = 52;
				this.match(LanguageParser.T__1);
				this.state = 53;
				this.elseIfBlock();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elseIfBlock(): ElseIfBlockContext {
		let _localctx: ElseIfBlockContext = new ElseIfBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, LanguageParser.RULE_elseIfBlock);
		try {
			this.state = 58;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case LanguageParser.T__19:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 56;
				this.block();
				}
				break;
			case LanguageParser.T__0:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 57;
				this.ifBlock();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public whileBlock(): WhileBlockContext {
		let _localctx: WhileBlockContext = new WhileBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, LanguageParser.RULE_whileBlock);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 60;
			this.match(LanguageParser.WHILE);
			this.state = 61;
			this.expression(0);
			this.state = 62;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, LanguageParser.RULE_assignment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 64;
			this.match(LanguageParser.IDENTIFIER);
			this.state = 65;
			this.match(LanguageParser.T__2);
			this.state = 66;
			this.expression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, LanguageParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 68;
			this.match(LanguageParser.IDENTIFIER);
			this.state = 69;
			this.match(LanguageParser.T__3);
			this.state = 78;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << LanguageParser.T__3) | (1 << LanguageParser.T__6) | (1 << LanguageParser.INTEGER) | (1 << LanguageParser.FLOAT) | (1 << LanguageParser.STRING) | (1 << LanguageParser.BOOL) | (1 << LanguageParser.NULL) | (1 << LanguageParser.IDENTIFIER))) !== 0)) {
				{
				this.state = 70;
				this.expression(0);
				this.state = 75;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === LanguageParser.T__4) {
					{
					{
					this.state = 71;
					this.match(LanguageParser.T__4);
					this.state = 72;
					this.expression(0);
					}
					}
					this.state = 77;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 80;
			this.match(LanguageParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 16;
		this.enterRecursionRule(_localctx, 16, LanguageParser.RULE_expression, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 92;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				_localctx = new ConstantExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 83;
				this.constant();
				}
				break;

			case 2:
				{
				_localctx = new IdentifierExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 84;
				this.match(LanguageParser.IDENTIFIER);
				}
				break;

			case 3:
				{
				_localctx = new FunctionCallExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 85;
				this.functionCall();
				}
				break;

			case 4:
				{
				_localctx = new ParanthesizedExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 86;
				this.match(LanguageParser.T__3);
				this.state = 87;
				this.expression(0);
				this.state = 88;
				this.match(LanguageParser.T__5);
				}
				break;

			case 5:
				{
				_localctx = new NotExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 90;
				this.match(LanguageParser.T__6);
				this.state = 91;
				this.expression(5);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 112;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 110;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExpressionContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, LanguageParser.RULE_expression);
						this.state = 94;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 95;
						this.multOp();
						this.state = 96;
						this.expression(5);
						}
						break;

					case 2:
						{
						_localctx = new AdditiveExpressionContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, LanguageParser.RULE_expression);
						this.state = 98;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 99;
						this.addOp();
						this.state = 100;
						this.expression(4);
						}
						break;

					case 3:
						{
						_localctx = new ComparisonExpressionContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, LanguageParser.RULE_expression);
						this.state = 102;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 103;
						this.compareOp();
						this.state = 104;
						this.expression(3);
						}
						break;

					case 4:
						{
						_localctx = new BooleanExpressionContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, LanguageParser.RULE_expression);
						this.state = 106;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 107;
						this.boolOp();
						this.state = 108;
						this.expression(2);
						}
						break;
					}
					}
				}
				this.state = 114;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public multOp(): MultOpContext {
		let _localctx: MultOpContext = new MultOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, LanguageParser.RULE_multOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 115;
			_la = this._input.LA(1);
			if (!(_la === LanguageParser.T__7 || _la === LanguageParser.T__8)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public addOp(): AddOpContext {
		let _localctx: AddOpContext = new AddOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, LanguageParser.RULE_addOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 117;
			_la = this._input.LA(1);
			if (!(_la === LanguageParser.T__9 || _la === LanguageParser.T__10)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public compareOp(): CompareOpContext {
		let _localctx: CompareOpContext = new CompareOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, LanguageParser.RULE_compareOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 119;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << LanguageParser.T__11) | (1 << LanguageParser.T__12) | (1 << LanguageParser.T__13) | (1 << LanguageParser.T__14) | (1 << LanguageParser.T__15) | (1 << LanguageParser.T__16))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public boolOp(): BoolOpContext {
		let _localctx: BoolOpContext = new BoolOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, LanguageParser.RULE_boolOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 121;
			_la = this._input.LA(1);
			if (!(_la === LanguageParser.T__17 || _la === LanguageParser.T__18)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public constant(): ConstantContext {
		let _localctx: ConstantContext = new ConstantContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, LanguageParser.RULE_constant);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 123;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << LanguageParser.INTEGER) | (1 << LanguageParser.FLOAT) | (1 << LanguageParser.STRING) | (1 << LanguageParser.BOOL) | (1 << LanguageParser.NULL))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, LanguageParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 125;
			this.match(LanguageParser.T__19);
			this.state = 129;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << LanguageParser.T__0) | (1 << LanguageParser.WHILE) | (1 << LanguageParser.IDENTIFIER))) !== 0)) {
				{
				{
				this.state = 126;
				this.line();
				}
				}
				this.state = 131;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 132;
			this.match(LanguageParser.T__20);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 8:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 4);

		case 1:
			return this.precpred(this._ctx, 3);

		case 2:
			return this.precpred(this._ctx, 2);

		case 3:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03 \x89\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x03\x02\x07\x02\"\n\x02\f\x02\x0E" +
		"\x02%\v\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x05\x03,\n\x03\x03" +
		"\x04\x03\x04\x05\x040\n\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x05\x05\x059\n\x05\x03\x06\x03\x06\x05\x06=\n\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03" +
		"\t\x07\tL\n\t\f\t\x0E\tO\v\t\x05\tQ\n\t\x03\t\x03\t\x03\n\x03\n\x03\n" +
		"\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x05\n_\n\n\x03\n\x03\n\x03" +
		"\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03" +
		"\n\x03\n\x07\nq\n\n\f\n\x0E\nt\v\n\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r" +
		"\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03\x10\x07\x10\x82\n\x10\f\x10" +
		"\x0E\x10\x85\v\x10\x03\x10\x03\x10\x03\x10\x02\x02\x03\x12\x11\x02\x02" +
		"\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16" +
		"\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02\x02\x07\x03\x02\n\v\x03\x02\f\r\x03" +
		"\x02\x0E\x13\x03\x02\x14\x15\x03\x02\x1A\x1E\x02\x8A\x02#\x03\x02\x02" +
		"\x02\x04+\x03\x02\x02\x02\x06/\x03\x02\x02\x02\b3\x03\x02\x02\x02\n<\x03" +
		"\x02\x02\x02\f>\x03\x02\x02\x02\x0EB\x03\x02\x02\x02\x10F\x03\x02\x02" +
		"\x02\x12^\x03\x02\x02\x02\x14u\x03\x02\x02\x02\x16w\x03\x02\x02\x02\x18" +
		"y\x03\x02\x02\x02\x1A{\x03\x02\x02\x02\x1C}\x03\x02\x02\x02\x1E\x7F\x03" +
		"\x02\x02\x02 \"\x05\x04\x03\x02! \x03\x02\x02\x02\"%\x03\x02\x02\x02#" +
		"!\x03\x02\x02\x02#$\x03\x02\x02\x02$&\x03\x02\x02\x02%#\x03\x02\x02\x02" +
		"&\'\x07\x02\x02\x03\'\x03\x03\x02\x02\x02(,\x05\x06\x04\x02),\x05\b\x05" +
		"\x02*,\x05\f\x07\x02+(\x03\x02\x02\x02+)\x03\x02\x02\x02+*\x03\x02\x02" +
		"\x02,\x05\x03\x02\x02\x02-0\x05\x0E\b\x02.0\x05\x10\t\x02/-\x03\x02\x02" +
		"\x02/.\x03\x02\x02\x0201\x03\x02\x02\x0212\x07\x18\x02\x022\x07\x03\x02" +
		"\x02\x0234\x07\x03\x02\x0245\x05\x12\n\x0258\x05\x1E\x10\x0267\x07\x04" +
		"\x02\x0279\x05\n\x06\x0286\x03\x02\x02\x0289\x03\x02\x02\x029\t\x03\x02" +
		"\x02\x02:=\x05\x1E\x10\x02;=\x05\b\x05\x02<:\x03\x02\x02\x02<;\x03\x02" +
		"\x02\x02=\v\x03\x02\x02\x02>?\x07\x19\x02\x02?@\x05\x12\n\x02@A\x05\x1E" +
		"\x10\x02A\r\x03\x02\x02\x02BC\x07 \x02\x02CD\x07\x05\x02\x02DE\x05\x12" +
		"\n\x02E\x0F\x03\x02\x02\x02FG\x07 \x02\x02GP\x07\x06\x02\x02HM\x05\x12" +
		"\n\x02IJ\x07\x07\x02\x02JL\x05\x12\n\x02KI\x03\x02\x02\x02LO\x03\x02\x02" +
		"\x02MK\x03\x02\x02\x02MN\x03\x02\x02\x02NQ\x03\x02\x02\x02OM\x03\x02\x02" +
		"\x02PH\x03\x02\x02\x02PQ\x03\x02\x02\x02QR\x03\x02\x02\x02RS\x07\b\x02" +
		"\x02S\x11\x03\x02\x02\x02TU\b\n\x01\x02U_\x05\x1C\x0F\x02V_\x07 \x02\x02" +
		"W_\x05\x10\t\x02XY\x07\x06\x02\x02YZ\x05\x12\n\x02Z[\x07\b\x02\x02[_\x03" +
		"\x02\x02\x02\\]\x07\t\x02\x02]_\x05\x12\n\x07^T\x03\x02\x02\x02^V\x03" +
		"\x02\x02\x02^W\x03\x02\x02\x02^X\x03\x02\x02\x02^\\\x03\x02\x02\x02_r" +
		"\x03\x02\x02\x02`a\f\x06\x02\x02ab\x05\x14\v\x02bc\x05\x12\n\x07cq\x03" +
		"\x02\x02\x02de\f\x05\x02\x02ef\x05\x16\f\x02fg\x05\x12\n\x06gq\x03\x02" +
		"\x02\x02hi\f\x04\x02\x02ij\x05\x18\r\x02jk\x05\x12\n\x05kq\x03\x02\x02" +
		"\x02lm\f\x03\x02\x02mn\x05\x1A\x0E\x02no\x05\x12\n\x04oq\x03\x02\x02\x02" +
		"p`\x03\x02\x02\x02pd\x03\x02\x02\x02ph\x03\x02\x02\x02pl\x03\x02\x02\x02" +
		"qt\x03\x02\x02\x02rp\x03\x02\x02\x02rs\x03\x02\x02\x02s\x13\x03\x02\x02" +
		"\x02tr\x03\x02\x02\x02uv\t\x02\x02\x02v\x15\x03\x02\x02\x02wx\t\x03\x02" +
		"\x02x\x17\x03\x02\x02\x02yz\t\x04\x02\x02z\x19\x03\x02\x02\x02{|\t\x05" +
		"\x02\x02|\x1B\x03\x02\x02\x02}~\t\x06\x02\x02~\x1D\x03\x02\x02\x02\x7F" +
		"\x83\x07\x16\x02\x02\x80\x82\x05\x04\x03\x02\x81\x80\x03\x02\x02\x02\x82" +
		"\x85\x03\x02\x02\x02\x83\x81\x03\x02\x02\x02\x83\x84\x03\x02\x02\x02\x84" +
		"\x86\x03\x02\x02\x02\x85\x83\x03\x02\x02\x02\x86\x87\x07\x17\x02\x02\x87" +
		"\x1F\x03\x02\x02\x02\r#+/8<MP^pr\x83";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!LanguageParser.__ATN) {
			LanguageParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(LanguageParser._serializedATN));
		}

		return LanguageParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(LanguageParser.EOF, 0); }
	public line(): LineContext[];
	public line(i: number): LineContext;
	public line(i?: number): LineContext | LineContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LineContext);
		} else {
			return this.getRuleContext(i, LineContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_program; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LineContext extends ParserRuleContext {
	public statement(): StatementContext | undefined {
		return this.tryGetRuleContext(0, StatementContext);
	}
	public ifBlock(): IfBlockContext | undefined {
		return this.tryGetRuleContext(0, IfBlockContext);
	}
	public whileBlock(): WhileBlockContext | undefined {
		return this.tryGetRuleContext(0, WhileBlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_line; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitLine) {
			return visitor.visitLine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public NEWLINE(): TerminalNode { return this.getToken(LanguageParser.NEWLINE, 0); }
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_statement; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfBlockContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public elseIfBlock(): ElseIfBlockContext | undefined {
		return this.tryGetRuleContext(0, ElseIfBlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_ifBlock; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitIfBlock) {
			return visitor.visitIfBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElseIfBlockContext extends ParserRuleContext {
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	public ifBlock(): IfBlockContext | undefined {
		return this.tryGetRuleContext(0, IfBlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_elseIfBlock; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitElseIfBlock) {
			return visitor.visitElseIfBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WhileBlockContext extends ParserRuleContext {
	public WHILE(): TerminalNode { return this.getToken(LanguageParser.WHILE, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_whileBlock; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitWhileBlock) {
			return visitor.visitWhileBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(LanguageParser.IDENTIFIER, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_assignment; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(LanguageParser.IDENTIFIER, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_functionCall; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_expression; }
	public copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class ConstantExpressionContext extends ExpressionContext {
	public constant(): ConstantContext {
		return this.getRuleContext(0, ConstantContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitConstantExpression) {
			return visitor.visitConstantExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdentifierExpressionContext extends ExpressionContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(LanguageParser.IDENTIFIER, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitIdentifierExpression) {
			return visitor.visitIdentifierExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FunctionCallExpressionContext extends ExpressionContext {
	public functionCall(): FunctionCallContext {
		return this.getRuleContext(0, FunctionCallContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitFunctionCallExpression) {
			return visitor.visitFunctionCallExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParanthesizedExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitParanthesizedExpression) {
			return visitor.visitParanthesizedExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NotExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitNotExpression) {
			return visitor.visitNotExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiplicativeExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public multOp(): MultOpContext {
		return this.getRuleContext(0, MultOpContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AdditiveExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public addOp(): AddOpContext {
		return this.getRuleContext(0, AddOpContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ComparisonExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public compareOp(): CompareOpContext {
		return this.getRuleContext(0, CompareOpContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitComparisonExpression) {
			return visitor.visitComparisonExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BooleanExpressionContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public boolOp(): BoolOpContext {
		return this.getRuleContext(0, BoolOpContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitBooleanExpression) {
			return visitor.visitBooleanExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultOpContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_multOp; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitMultOp) {
			return visitor.visitMultOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AddOpContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_addOp; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitAddOp) {
			return visitor.visitAddOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompareOpContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_compareOp; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitCompareOp) {
			return visitor.visitCompareOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BoolOpContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_boolOp; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitBoolOp) {
			return visitor.visitBoolOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantContext extends ParserRuleContext {
	public INTEGER(): TerminalNode | undefined { return this.tryGetToken(LanguageParser.INTEGER, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(LanguageParser.FLOAT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(LanguageParser.STRING, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(LanguageParser.BOOL, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(LanguageParser.NULL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_constant; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitConstant) {
			return visitor.visitConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public line(): LineContext[];
	public line(i: number): LineContext;
	public line(i?: number): LineContext | LineContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LineContext);
		} else {
			return this.getRuleContext(i, LineContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return LanguageParser.RULE_block; }
	// @Override
	public accept<Result>(visitor: LanguageVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


