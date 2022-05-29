import Link from 'next/link';
import react from 'react';
import '../../configureAmplify';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

export const Navbar = () => {
	const [signedUser, setSignedUser] = useState(false);

	useEffect(() => {
		authListener();
	});
	async function authListener() {
		Hub.listen('auth', (data) => {
			switch (data.payload.event) {
				case 'signIn':
					return setSignedUser(true);
				case 'signOut':
					return setSignedUser(false);
			}
		});

		try {
			await Auth.currentAuthenticatedUser();
			setSignedUser(true);
		} catch (err) {
			console.log('error', err);
		}
	}
	return (
		<nav className="flex justify-center py-3 space-x-4 border-b bg-cyan-500">
			{[
				['Home', '/'],
				['Create Post', '/create-post'],
				['Profile', '/profile'],
			].map(([title, url], index) => (
				<Link href={url} key={index}>
					<a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100">
						{title}
					</a>
				</Link>
			))}

			{!signedUser && (
				<Link href="my-posts">
					<a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:text-black hover:bg-slage-100">
						My posts
					</a>
				</Link>
			)}
		</nav>
	);
};
