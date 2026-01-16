// Generated from src/antlr/Language.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ConstantExpressionContext } from "./LanguageParser";
import { IdentifierExpressionContext } from "./LanguageParser";
import { FunctionCallExpressionContext } from "./LanguageParser";
import { ParanthesizedExpressionContext } from "./LanguageParser";
import { NotExpressionContext } from "./LanguageParser";
import { MultiplicativeExpressionContext } from "./LanguageParser";
import { AdditiveExpressionContext } from "./LanguageParser";
import { ComparisonExpressionContext } from "./LanguageParser";
import { BooleanExpressionContext } from "./LanguageParser";
import { ProgramContext } from "./LanguageParser";
import { LineContext } from "./LanguageParser";
import { StatementContext } from "./LanguageParser";
import { IfBlockContext } from "./LanguageParser";
import { ElseIfBlockContext } from "./LanguageParser";
import { WhileBlockContext } from "./LanguageParser";
import { AssignmentContext } from "./LanguageParser";
import { FunctionCallContext } from "./LanguageParser";
import { ExpressionContext } from "./LanguageParser";
import { MultOpContext } from "./LanguageParser";
import { AddOpContext } from "./LanguageParser";
import { CompareOpContext } from "./LanguageParser";
import { BoolOpContext } from "./LanguageParser";
import { ConstantContext } from "./LanguageParser";
import { BlockContext } from "./LanguageParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `LanguageParser`.
 */
export interface LanguageListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `constantExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterConstantExpression?: (ctx: ConstantExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `constantExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitConstantExpression?: (ctx: ConstantExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `identifierExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterIdentifierExpression?: (ctx: IdentifierExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `identifierExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitIdentifierExpression?: (ctx: IdentifierExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `functionCallExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `functionCallExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `paranthesizedExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterParanthesizedExpression?: (ctx: ParanthesizedExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `paranthesizedExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitParanthesizedExpression?: (ctx: ParanthesizedExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `notExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNotExpression?: (ctx: NotExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `notExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNotExpression?: (ctx: NotExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `multiplicativeExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `multiplicativeExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `additiveExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `additiveExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `comparisonExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterComparisonExpression?: (ctx: ComparisonExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `comparisonExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitComparisonExpression?: (ctx: ComparisonExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `booleanExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterBooleanExpression?: (ctx: BooleanExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `booleanExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitBooleanExpression?: (ctx: BooleanExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.line`.
	 * @param ctx the parse tree
	 */
	enterLine?: (ctx: LineContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.line`.
	 * @param ctx the parse tree
	 */
	exitLine?: (ctx: LineContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.ifBlock`.
	 * @param ctx the parse tree
	 */
	enterIfBlock?: (ctx: IfBlockContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.ifBlock`.
	 * @param ctx the parse tree
	 */
	exitIfBlock?: (ctx: IfBlockContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.elseIfBlock`.
	 * @param ctx the parse tree
	 */
	enterElseIfBlock?: (ctx: ElseIfBlockContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.elseIfBlock`.
	 * @param ctx the parse tree
	 */
	exitElseIfBlock?: (ctx: ElseIfBlockContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.whileBlock`.
	 * @param ctx the parse tree
	 */
	enterWhileBlock?: (ctx: WhileBlockContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.whileBlock`.
	 * @param ctx the parse tree
	 */
	exitWhileBlock?: (ctx: WhileBlockContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.multOp`.
	 * @param ctx the parse tree
	 */
	enterMultOp?: (ctx: MultOpContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.multOp`.
	 * @param ctx the parse tree
	 */
	exitMultOp?: (ctx: MultOpContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.addOp`.
	 * @param ctx the parse tree
	 */
	enterAddOp?: (ctx: AddOpContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.addOp`.
	 * @param ctx the parse tree
	 */
	exitAddOp?: (ctx: AddOpContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.compareOp`.
	 * @param ctx the parse tree
	 */
	enterCompareOp?: (ctx: CompareOpContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.compareOp`.
	 * @param ctx the parse tree
	 */
	exitCompareOp?: (ctx: CompareOpContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.boolOp`.
	 * @param ctx the parse tree
	 */
	enterBoolOp?: (ctx: BoolOpContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.boolOp`.
	 * @param ctx the parse tree
	 */
	exitBoolOp?: (ctx: BoolOpContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.constant`.
	 * @param ctx the parse tree
	 */
	enterConstant?: (ctx: ConstantContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.constant`.
	 * @param ctx the parse tree
	 */
	exitConstant?: (ctx: ConstantContext) => void;

	/**
	 * Enter a parse tree produced by `LanguageParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `LanguageParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;
}

