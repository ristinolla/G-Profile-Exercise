/**
* Created by Perttu based on PeopleServlet from: https://github.com/googleplus/gplus-quickstart-java
**/

package com.perttu.gplus;


import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.plus.Plus;
import com.google.api.services.plus.model.Person;
import com.google.gson.Gson;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
* Get list of people user has shared with this app.
*/
public class ProfileServlet extends HttpServlet {

	// TODO: Nama vois olla UTILSseissakin..
	private static final HttpTransport TRANSPORT = new NetHttpTransport();
	private static final JacksonFactory JSON_FACTORY = new JacksonFactory();
	private static final Gson GSON = new Gson();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");

		// Only fetch a list of people for connected users.
		String tokenData = (String) request.getSession().getAttribute("token");
		if (tokenData == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().print(GSON.toJson("Current user not connected"));
			return;
		}
		try {

			// TODO: Tamakin vois varmaan olla UTILSeissea
			//Build credential from stored token data.
			GoogleCredential credential = new GoogleCredential.Builder()
					.setJsonFactory(JSON_FACTORY)
					.setTransport(TRANSPORT)
					.setClientSecrets(Utils.getClientID(), Utils.getClientSecret()).build()
					.setFromTokenResponse(JSON_FACTORY.fromString(
							tokenData, GoogleTokenResponse.class));
			// Create a new authorized API client.
			Plus service = new Plus.Builder(TRANSPORT, JSON_FACTORY, credential)
					.setApplicationName(Utils.getApplicationName())
					.build();

			//Get profile infomration and output it to response as JSON
			Person profile = service.people().get("me").execute();
			response.setStatus(HttpServletResponse.SC_OK);
			response.getWriter().print(GSON.toJson(profile));
		} catch (IOException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().print(GSON.toJson("Failed to read data from Google. " +
					e.getMessage()));
		}
	}
}
