import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";

interface Options {
	[key: string]: any;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasSpecialCharacter: boolean;
	hasNumber: boolean;
	hasWhiteSpace: boolean;
}

interface OptionsInput extends Options {
	length: number;
}

export function passGenerate(length: number, options: Options, customCharacters: string = "(){}[];,.:-_+#%$£!@?"): string {
	let characters: string = "qwertyuiopasdfghjklzxcvbnm";
	let numbers: string = "0123456789";
	let specialCharacters: string = customCharacters;

	let characterpool = "";

	let result: string[] = "_".repeat(length).split("");
	let freeSpaces = [];
	// Generate lowercase //

	// calculate spaces
	freeSpaces = Array.from(Array(length).keys());
	let freeSlots = freeSpaces.length;

	let busySpaces = 0; // spaces that are 100% occupied

	// Get number of free spaces
	for (const key in options) {
		if (options[key] === true) {
			busySpaces += 1;
		}
	}

	// Create password

	// fill necessary options
	let optionsIn: Options = {
		hasUppercase: true,
		hasLowercase: true,
		hasSpecialCharacter: true,
		hasNumber: true,
		hasWhiteSpace: true,
	};

	for (let j = 0; j < 1; j++) {
		if (options.hasLowercase && options.hasLowercase) {
			let position = Math.floor(Math.random() * freeSpaces.length);

			result[freeSpaces[position]] = characters[Math.floor(Math.random() * characters.length)];

			freeSpaces.splice(position, 1);
			optionsIn.hasLowercase = false;
			characterpool += characters;
		}
		if (options.hasUppercase && optionsIn.hasUppercase) {
			let position = Math.floor(Math.random() * freeSpaces.length);

			result[freeSpaces[position]] = characters[Math.floor(Math.random() * characters.length)].toUpperCase();

			freeSpaces.splice(position, 1);
			optionsIn.hasUppercase = false;
			characterpool += characters.toUpperCase();
		}
		if (options.hasNumber && optionsIn.hasNumber === true) {
			let position = Math.floor(Math.random() * freeSpaces.length);
			result[freeSpaces[position]] = numbers[Math.floor(Math.random() * numbers.length)];

			freeSpaces.splice(position, 1);
			optionsIn.hasNumber = false;
			characterpool += numbers;
		}

		if (options.hasSpecialCharacter && optionsIn.hasSpecialCharacter) {
			let position = Math.floor(Math.random() * freeSpaces.length);
			result[freeSpaces[position]] = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

			freeSpaces.splice(position, 1);
			optionsIn.hasSpecialCharacter = false;
			characterpool += specialCharacters;
		}

		if (options.hasWhiteSpace && optionsIn.hasWhiteSpace) {
			let position = Math.floor(Math.random() * freeSpaces.length);
			result[freeSpaces[position]] = " ";
			freeSpaces.splice(position, 1);
			optionsIn.hasWhiteSpace = false;

			// fill with same number of numbers list
			characterpool += " ".repeat(Math.floor(Math.random() * numbers.length));
		}
	}

	// completes missing slots
	freeSlots = freeSpaces.length;
	for (let i = 0; i < length; i++) {
		if (freeSlots === 0) {
			break;
		}
		let position = Math.floor(Math.random() * freeSpaces.length);
		result[freeSpaces[position]] = characterpool[Math.floor(Math.random() * characterpool.length)];
		freeSpaces.splice(position, 1);
		freeSlots -= 1;
	}
	console.log(measurePassword(result.join("")));

	return result.join("");
}

export const measurePassword = (password: string) => {
	const options = {
		translations: zxcvbnEnPackage.translations,
		dictionary: {
			...zxcbnCommonPackage.dictionary,
		},
		graphs: zxcbnCommonPackage.adjacencyGraphs,
	};

	zxcvbnOptions.setOptions(options);

	return zxcvbn(password);
};
