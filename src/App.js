import React, {Component} from 'react'
import './App.css'
import Board from 'react-trello'
import { persistr } from '@persistr/js'
import { v4 as uuidv4 } from 'uuid'

const laneIDs = [uuidv4(), uuidv4(), uuidv4(), uuidv4()]

class App extends Component {
    state = {boardData: {lanes: []}}

    setEventBus = eventBus => {
        this.setState({eventBus})
    }

    async componentWillMount() {
        // Connect to Persistr database.
        this.account = await persistr.local() // local() means database will be in memory
        this.repository = this.account.db('examples').ns('tasks')

        // Fill the database with example data.

        // Example lanes.
        await this.repository.stream(laneIDs[0]).events().write('Lane Created', {
            title: 'Planned Tasks',
            label: ''
        })
        await this.repository.stream(laneIDs[1]).events().write('Lane Created', {
            title: 'Work In Progress',
            label: ''
        })
        await this.repository.stream(laneIDs[2]).events().write('Lane Created', {
            title: 'Blocked',
            label: ''
        })
        await this.repository.stream(laneIDs[3]).events().write('Lane Created', {
            title: 'Completed',
            label: ''
        })

        // Example cards.
        await this.repository.stream(uuidv4()).events().write('Card Created', {
            title: 'Buy milk',
            description: '2 Gallons of milk at the Deli store',
            label: '15 mins',
            lane: laneIDs[0]
        })
        await this.repository.stream(uuidv4()).events().write('Card Created', {
            title: 'Dispose Garbage',
            description: 'Sort out recyclable and waste as needed',
            label: '10 mins',
            lane: laneIDs[0]
        })
        await this.repository.stream(uuidv4()).events().write('Card Created', {
            title: 'Write Blog',
            description: 'Can AI make memes?',
            label: '30 mins',
            lane: laneIDs[0]
        })
        await this.repository.stream(uuidv4()).events().write('Card Created', {
            title: 'Pay Rent',
            description: 'Transfer to bank account',
            label: '5 mins',
            lane: laneIDs[0]
        })

        // Done with adding initial example data to our database!

        const response = await this.getBoard()
        this.setState({boardData: response})

        // Establish a real-time subscription to the database.
        // If any data changes, we will be notified here in real-time.
        this.repository.events().each(event => {
            if (event.meta.type === 'Card Created') {
                // Add the new card to the board.
                console.log('Publishing new card')
                this.state.eventBus.publish({
                    type: 'ADD_CARD',
                    laneId: event.data.lane,
                    card: {
                        id: event.meta.stream,
                        title: event.data.title,
                        description: event.data.description,
                        label: event.data.label
                    }
                })
            }
        })
    }

    async getBoard() {
        // Project the event stream into a query result.
        // This would typically be done on the server-side in real-time and
        // the results would be cached in a reporting database.

        const lanes = []

        // Get a list of all lanes.
        await this.repository
            .events('Lane Created')
            .each(event => {
                // Locate the lane.
                let lane = undefined
                for (let i = 0; i < lanes.length; i++) {
                    if (lanes[i].id === event.meta.stream) {
                        lane = lanes[i]
                        break
                    }
                }

                // Add a new lane, if needed.
                if (!lane) {
                    lane = {
                        id: event.meta.stream,
                        title: event.data.title,
                        label: event.data.label,
                        style: { width: 280 },
                        cards: []
                    }
                    lanes.push(lane)
                }
            })

        // Get a list of all cards.
        await this.repository
            .events('Card Created')
            .each(event => {
                // Find the lane for this card.
                let lane = undefined
                for (let i = 0; i < lanes.length; i++) {
                    if (lanes[i].id === event.data.lane) {
                        lane = lanes[i]
                        break
                    }
                }

                // Add the card to the lane.
                if (lane) {
                    lane.cards.push({
                        id: event.meta.stream,
                        title: event.data.title,
                        description: event.data.description,
                        label: event.data.label,
                        cardStyle: { width: 270, maxWidth: 270, margin: 'auto', marginBottom: 5 }
                    })
                }
            })

        // Return the query results.
        return { lanes }
    }

    logEventStream = () => {
        console.log('EVENT STREAM:')
        this.repository.events({ until: 'caught-up' }).each(event => console.log(event.meta.type, event))
    }

    simulateNewCard = () => {
        console.log('Server added new card')
        this.repository.stream(uuidv4()).events().write('Card Created', {
            title: 'New Server Card',
            description: 'Server notified us that this card was added to database',
            label: '30 mins',
            lane: laneIDs[1]
        })
    }

	onCardAdded = (card, laneId) => {
        // Add a new card to the database.
        this.repository.stream(card.id).events().write('Card Created', {
            title: card.title,
            description: card.description,
            label: card.label,
            lane: laneId
        })
        console.log('New card added', card)
	}

    onCardDeleted = (cardId, laneId) => {
        // Add a new card to the database.
        this.repository.stream(cardId).events().write('Card Deleted', {})
        console.log('Card deleted')
    }

    onCardMovedAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {
        // Add a new card to the database.
        this.repository.stream(cardId).events().write('Card Moved', {
            lane: toLaneId
        })
        console.log('Card moved')
    }

    onLaneAdded = (lane) => {
        // Add a new card to the database.
        this.repository.stream(lane.id).events().write('Lane Created', {
            title: lane.title,
            label: lane.label
        })
        console.log('New lane added', lane)
    }

    onLaneDeleted = (laneId) => {
        // Add a new card to the database.
        this.repository.stream(laneId).events().write('Lane Deleted', {})
        console.log('Lane deleted')
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h3>Persistr React Trello Demo</h3>
                </div>
                <div className="App-intro">
                    <button onClick={this.logEventStream} style={{margin: 5}}>
                        Log Event Stream
                    </button>
                    <button onClick={this.simulateNewCard} style={{margin: 5}}>
                        Simulate New Card From Server-Side
                    </button>
                    <Board
                        draggable
                        editable
                        data={this.state.boardData}
						onCardAdd={this.onCardAdded}
                        onCardDelete={this.onCardDeleted}
                        onCardMoveAcrossLanes={this.onCardMovedAcrossLanes}
                        onLaneAdd={this.onLaneAdded}
                        onLaneDelete={this.onLaneDeleted}
                        eventBusHandle={this.setEventBus}
                    />
                </div>
            </div>
        )
    }
}

export default App
