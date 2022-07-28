import { Breadcrumb, Layout, Menu, Input, Row, Col, Grid } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.less";
import logo from "./logo.svg";
import PokemonCard from "./components/PokemonCard";
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { useBreakpoint } = Grid;





const API_URL = "https://pokeapi.co/api/v2/";
const IMG_URL = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
const MASTER_SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/649.svg";

const onSearch = (value) => console.log(value);

// This function return the Id of the pokemon coming from the URL
const getId = (string, isImage) => {
	let id = string.split(`${API_URL}pokemon/`)[1].split("/")[0];

	// append leading 0's to make sure they pass properly to the image URL
	if (id < 10) id = `00${id}`;
	if (id < 100 && id > 9) id = `0${id}`;
	if (isImage) {
		return id + ".png";
	} else {
		return id;
	}
};

// Genereations of Pokemon
const gen1 = "pokemon?limit=10000";

const searchPokemon = (query) => {
	return `${API_URL + query}`;
};

//Think about how to use this function recursively to fix the issue with URL
const useAxios = () => {
	const [pokemon, setPokemon] = useState([]);
	const [error, setError] = useState("");
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		axios
			.get(searchPokemon(gen1))
			.then((res) => {
				const data = res.data.results;
				data.forEach((element) => {
					element.imgUrl = `${IMG_URL + getId(element.url, true)}`;
				});
				return setPokemon(data);
      })
			.catch((error) => setError(error.message))
			.finally(() => setLoaded(true));
	}, []);
	return { pokemon, error, loaded };
};

const App = () => {

  console.log(useBreakpoint());
	const { pokemon } = useAxios();

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header
				style={{
					position: "fixed",
					zIndex: 1,
					width: "100%",
					display: "flex",
					alignItems: "center",
				}}>
				<div className="logo-container">
					<img src={logo} className="logo" alt="logo" />
				</div>

				<Menu
					style={{ width: "70vw" }}
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={["1"]}
					onClick={(some) => console.log(some)}
					items={new Array(3).fill(null).map((_, index) => ({
						key: String(index + 1),
						label: `Gen ${index + 1}`,
					}))}
				/>
				<Search addonBefore="pokemon/" placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 304 }} />
			</Header>
			<Content
				className="site-layout"
				style={{
					padding: "0 25px",
					marginTop: 64,
				}}>
				<Breadcrumb
					style={{
						margin: "16px 0",
					}}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>List</Breadcrumb.Item>
					<Breadcrumb.Item>App</Breadcrumb.Item>
				</Breadcrumb>
				<div
					className="site-layout-background"
					style={{
						padding: 24,
						minHeight: 380,
					}}>
					<div className="site-card-border-less-wrapper">
						<Row gutter={[32, 32]}>
							{pokemon.map((poke, index) => {
								return (
                  <Col xs={6} sm={4} md={4 } lg={2} key={index}>
                    <PokemonCard poke={poke}/> 
									</Col>
								);
							})}
						</Row>
					</div>
				</div>
			</Content>
			<Footer
				style={{
					textAlign: "center",
				}}>
				Ant Design ©2018 Created by Ant UED
			</Footer>
		</Layout>
	);
};
export default App;
