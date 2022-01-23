// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {TestBlockFactory} from '../test/testBlockFactory'

import {createPatchesFromBoards, createBoard, IPropertyTemplate} from './board'

describe('board tests', () => {
    describe('correctly generate patches from two boards', () => {
        it('should generate two empty patches for the same board', () => {
            const board = TestBlockFactory.createBoard()
            const result = createPatchesFromBoards(board, board)
            expect(result).toMatchSnapshot()
        })

        it('should add properties on the update patch and remove them on the undo', () => {
            const board = TestBlockFactory.createBoard()
            board.properties = {
                "prop1": "val1",
                "prop2": "val2",
            }
            const oldBoard = createBoard(board)
            oldBoard.properties = {
                "prop2": "val2",
            }

            const result = createPatchesFromBoards(board, oldBoard)
            expect(result).toMatchSnapshot()
        })

        it('should add card properties on the redo and remove them on the undo', () => {
            const board = TestBlockFactory.createBoard()
            const oldBoard = createBoard(board)
            board.cardProperties.push({
                id: 'new-property-id',
                name: 'property-name',
                type: 'select',
                options: [{
                    id: 'opt',
                    value: 'val',
                    color: 'propColorYellow',
                }],
            })

            const result = createPatchesFromBoards(board, oldBoard)
            expect(result).toMatchSnapshot()
        })

        it('should add card properties on the redo and undo if they exists in both, but differ', () => {
            const cardProperty = {
                id: 'new-property-id',
                name: 'property-name',
                type: 'select',
                options: [{
                    id: 'opt',
                    value: 'val',
                    color: 'propColorYellow',
                }],
            } as IPropertyTemplate

            const board = TestBlockFactory.createBoard()
            const oldBoard = createBoard(board)
            board.cardProperties = [cardProperty]
            oldBoard.cardProperties = [{...cardProperty, name: 'a-different-name'}]

            const result = createPatchesFromBoards(board, oldBoard)
            expect(result).toMatchSnapshot()
        })

        it('should add card properties on the redo and undo if they exists in both, but their options are different', () => {
            const cardProperty = {
                id: 'new-property-id',
                name: 'property-name',
                type: 'select',
                options: [{
                    id: 'opt',
                    value: 'val',
                    color: 'propColorYellow',
                }],
            } as IPropertyTemplate

            const board = TestBlockFactory.createBoard()
            const oldBoard = createBoard(board)
            board.cardProperties = [cardProperty]
            oldBoard.cardProperties = [{
                ...cardProperty,
                options: [{
                    id: 'another-opt',
                    value: 'val',
                    color: 'propColorBrown',
                }],
            }]

            const result = createPatchesFromBoards(board, oldBoard)
            expect(result).toMatchSnapshot()
        })

        it('should update a column calculation on the redo and revert it on the undo', () => {
            const board = TestBlockFactory.createBoard()
            const oldBoard = createBoard(board)
            board.columnCalculations = {
                "cal1": "val1",
            }
            oldBoard.columnCalculations = {
                "cal1": "another-val1",
            }

            const result = createPatchesFromBoards(board, oldBoard)
            expect(result).toMatchSnapshot()
        })
    })
})