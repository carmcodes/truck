// Generated from src/antlr/Language.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `LanguageParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface LanguageVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `constantExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantExpression?: (ctx: ConstantExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `identifierExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierExpression?: (ctx: IdentifierExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `functionCallExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `paranthesizedExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParanthesizedExpression?: (ctx: ParanthesizedExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `notExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotExpression?: (ctx: NotExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `multiplicativeExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `additiveExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `comparisonExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparisonExpression?: (ctx: ComparisonExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `booleanExpression`
	 * labeled alternative in `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanExpression?: (ctx: BooleanExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.line`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLine?: (ctx: LineContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.ifBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfBlock?: (ctx: IfBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.elseIfBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElseIfBlock?: (ctx: ElseIfBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.whileBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileBlock?: (ctx: WhileBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.multOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultOp?: (ctx: MultOpContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.addOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAddOp?: (ctx: AddOpContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.compareOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompareOp?: (ctx: CompareOpContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.boolOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBoolOp?: (ctx: BoolOpContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.constant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstant?: (ctx: ConstantContext) => Result;

	/**
	 * Visit a parse tree produced by `LanguageParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;
}

