import { Devvit, useState, useRef } from '@devvit/public-api';

Devvit.configure({
	redditAPI: true,
});

Devvit.addMenuItem({
	label: 'Add my post',
	location: 'subreddit',
	forUserType: 'moderator',
	onPress: async (_event, context) => {
		const { reddit, ui } = context;
		try {
			ui.showToast(
				"Submitting your post - upon completion you'll navigate there."
			);

			const subreddit = await reddit.getCurrentSubreddit();
			const post = await reddit.submitPost({
				title: 'My devvit post',
				subredditName: subreddit.name,
				preview: (
					<vstack height='100%' width='100%' alignment='middle center'>
						<text size='large'>Loading ...</text>
					</vstack>
				),
			});
			ui.navigateTo(post);
		} catch (error: any) {
			ui.showToast(`Error: ${error.message || 'Something went wrong'}`);
		}
	},
});

Devvit.addCustomPostType({
	name: 'Tapscend Game',
	height: 'regular',
	render: () => {
		const [shapes, setShapes] = useState<Shape[]>([]);
		const [shapeCounter, setShapeCounter] = useState(0);
		const [gameActive, setGameActive] = useState(false);
		const [gameSpeed, setGameSpeed] = useState(1000);
		const [squareFrequency, setSquareFrequency] = useState(0.5);
		const [score, setScore] = useState(0);

		const gameInterval = useRef<any>(null);

		type Shape = {
			type: 'circle' | 'square';
			x: number;
			y: number;
			id: number;
		};

		// Function to start the game
		const startGame = () => {
			try {
				setScore(0);
				setShapes([]);
				setShapeCounter(0);
				setGameSpeed(1000);
				setSquareFrequency(0.5);
				setGameActive(true);

				// Start shape generation
				gameInterval.current = setInterval(generateShape, gameSpeed);
			} catch (error) {
				console.error('Error starting the game:', error);
			}
		};

		// Function to stop the game
		const stopGame = () => {
			try {
				setGameActive(false);
				if (gameInterval.current) {
					clearInterval(gameInterval.current);
					gameInterval.current = null;
				}
			} catch (error) {
				console.error('Error stopping the game:', error);
			}
		};

		// Function to generate shapes
		const generateShape = () => {
			if (!gameActive) return;

			try {
				const shapeType = Math.random() < squareFrequency ? 'square' : 'circle';
				const x = Math.random() * 90;
				const y = Math.random() * 90;

				const newShape: Shape = { type: shapeType, x, y, id: shapeCounter };
				setShapes((prev) => [...prev, newShape]);
				setShapeCounter((prev) => prev + 1);

				// Remove shape after 1 second
				setTimeout(() => {
					setShapes((prev) => prev.filter((s) => s.id !== newShape.id));
				}, 1000);
			} catch (error) {
				console.error('Error generating a shape:', error);
			}
		};

		// Function to handle shape click
		const handleClick = (shape: Shape) => {
			try {
				if (shape.type === 'square') {
					stopGame();
				} else {
					setScore((prev) => prev + 1);
					setShapes((prev) => prev.filter((s) => s.id !== shape.id));
				}
			} catch (error) {
				console.error('Error handling shape click:', error);
			}
		};

		return (
			<vstack height='100%' width='100%' alignment='center middle' gap='medium'>
				{/* Header */}
				<hstack alignment='center middle' gap='medium'>
					<text size='large' color='white'>
						Score: {score}
					</text>
				</hstack>

				{/* Game Area */}
				<vstack
					height='70%'
					width='90%'
					backgroundColor='#1f2937'
					cornerRadius='large'
					alignment='center middle'
					padding='medium'
				>
					{gameActive ? (
						shapes.map((shape) => (
							<vstack
								key={shape.id.toString()} // Convert id to string
								onPress={() => handleClick(shape)}
								height='48px'
								width='48px'
								backgroundColor={
									shape.type === 'circle' ? '#4b5563' : '#4f46e5'
								}
								cornerRadius={shape.type === 'circle' ? 'full' : 'small'}
								shadow='medium'
								position='absolute' // Correctly written position prop
								top={`${shape.y}%`}
								left={`${shape.x}%`}
							/>
						))
					) : (
						<vstack alignment='center middle' gap='medium'>
							<text size='xlarge' weight='bold' color='white'>
								Tapscend
							</text>
							<button appearance='primary' onPress={startGame} size='medium'>
								Start Game
							</button>
							<text size='medium' color='white'>
								Keep It Round, Forget the Edges!
							</text>
						</vstack>
					)}
				</vstack>
			</vstack>
		);
	},
});

export default Devvit;
