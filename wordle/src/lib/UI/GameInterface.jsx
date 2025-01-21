import React, { Component } from 'react';

// ButtonRow Component (for keyboard rows)
class ButtonRow extends Component {
    render() {
        const { buttons, handleButtonClick } = this.props;
        return (
            <div className="flex justify-center gap-x-1 sm:gap-x-2">
                {buttons.map((button) => (
                    <button
                        key={button.id}
                        id={button.id}
                        className="sm:text-2xl p-2 rounded-md bg-gray-500 text-white"
                        onClick={() => handleButtonClick(button.id)} // Calling the passed down method here
                    >
                        {button.label}
                    </button>
                ))}
            </div>
        );
    }
}

// Keyboard Component (renders the button rows)
class KeyboardUI extends Component {
    render() {
        const { handleButtonClick } = this.props;
        const buttonGroups = [
            [
                { id: 'Q', label: 'Q' }, { id: 'W', label: 'W' }, { id: 'E', label: 'E' }, { id: 'R', label: 'R' },
                { id: 'T', label: 'T' }, { id: 'Y', label: 'Y' }, { id: 'U', label: 'U' }, { id: 'I', label: 'I' },
                { id: 'O', label: 'O' }, { id: 'P', label: 'P' },
            ],
            [
                { id: 'A', label: 'A' }, { id: 'S', label: 'S' }, { id: 'D', label: 'D' }, { id: 'F', label: 'F' },
                { id: 'G', label: 'G' }, { id: 'H', label: 'H' }, { id: 'J', label: 'J' }, { id: 'K', label: 'K' },
                { id: 'L', label: 'L' },
            ],
            [
                { id: 'Enter', label: 'Enter' }, { id: 'Z', label: 'Z' }, { id: 'X', label: 'X' }, { id: 'C', label: 'C' },
                { id: 'V', label: 'V' }, { id: 'B', label: 'B' }, { id: 'N', label: 'N' }, { id: 'M', label: 'M' },
                { id: 'Erase', label: 'Erase' },
            ]
        ];

        return (
            <div className="space-y-3">
                {buttonGroups.map((group, index) => (
                    <ButtonRow key={index} buttons={group} handleButtonClick={handleButtonClick} />
                ))}
            </div>
        );
    }
}

// Main GameInterface Class that encapsulates all subcomponents
class GameInterface extends Component {
    render() {
        return (
            <div>
                {/* Render Keyboard and pass the custom handleButtonClick function to it */}
                <GameInterface.KeyboardUI handleButtonClick={this.props.handleButtonClick} />
            </div>
        );
    }
}

// Expose sub-components as static properties of GameInterface
GameInterface.KeyboardUI = KeyboardUI;

export default GameInterface;
