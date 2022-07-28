import React, { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import axios from "axios";
import cardColors from "../helpers/cardColors";
const { Meta } = Card;

export default function PokemonCard({ poke }) {
	const [pokeInfo, setPokeInfo] = useState([]);
	const [error, setError] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [dark, isDark] = useState(false);
	const [isAnother, setIsAnother] = useState(false);
	const { url } = poke;

	const gettypeForClass = (firstType) => {
		let key = firstType;
		let returnString = "";
		if (key == "ghost") {
			returnString = "dark-card";
		} else {
			returnString = "pokemon-card";
		}
		return returnString;
	};

	const getType = (firstType) => {
		let key = firstType;
		let returnObj = {};

		if (cardColors[key]) {
			returnObj.backgroundImage = `linear-gradient(to bottom right, ${cardColors[key]} )`;
		} else {
			returnObj.backgroundColor = "white";
		}

		return returnObj;
	};

	const cardStyle = {
		border: "1px solid black",
		borderRadius: "200px",
		boxShadow: "10px 5px 5px darkgrey",
		height: "115px",
	};

	//play with the card style
	const isAnotherCardStyle = {
		border: "1px solid black",
		borderRadius: "25px",
		boxShadow: "20px 10px 10px black",
		height: "35vh",
		// width: isAnother && "35vw",
		overflowX: "hidden",
		position: "absolute",
		top: "0",
		left: "0",
		zIndex: "50",
		animation: "pulse  0.3s",
	};
	useEffect(() => {
		axios
			.get(url)
			.then((results) => {
				setPokeInfo([results.data]);
			})
			.catch((error) => setError(error.message))
			.finally(() => setLoaded(true));
	}, [url]);

	return (
		<>
			{pokeInfo.map((info, index) => {
				// console.log(info);
				const firstType = info.types[0].type.name;
				const name = info.name.charAt(0).toUpperCase() + info.name.slice(1);
				const avatars = info.sprites.other.dream_world.front_default;
				if (loaded && isAnother) {
					return (
						<Card
							onMouseEnter={() => setIsAnother(true)}
							onMouseLeave={() => setIsAnother(false)}
							bordered={true}
							cover={
								<img
									src={isAnother ? avatars : poke.imgUrl}
									style={{ padding: isAnother && "1vw" }}
									className={isAnother ? "dark-card" : "pokemon-card"}
									alt={info.name}
								/>
							}
							key={index}
							style={{ ...getType(firstType), ...isAnotherCardStyle }}>
							<Meta
                avatar={<Avatar src={isAnother ? poke.imgUrl : avatars} />}
                title={<span className={gettypeForClass(firstType)}>{name}</span>}
                description={<p className={ gettypeForClass(firstType)}>This is a description</p>}
							/>
						</Card>
					);
				} else if (!isAnother) {
					return (
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div>#{info.id}</div>
								<div>{name}</div>
							</div>
							<Card
								onMouseEnter={() => setIsAnother(true)}
								onMouseLeave={() => setIsAnother(false)}
								bordered={true}
								cover={<img src={poke.imgUrl} className={"pokemon-card"} alt={info.name} />}
								key={index}
								style={{ ...getType(firstType), ...cardStyle }}></Card>
						</div>
					);
				}
			})}
		</>
	);
}
