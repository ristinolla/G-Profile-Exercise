
package com.perttu.gplus;

import com.google.api.client.auth.oauth2.TokenResponseException;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.plus.Plus;
import com.google.api.services.plus.model.PeopleFeed;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class Utils {

	  private static final JacksonFactory JSON_FACTORY = new JacksonFactory();
	  
	  /*
	   * Creates a client secrets object from the client_secrets.json file.
	   */	
	  public static final Object getGCredentials() {
		  GoogleClientSecrets clientSecrets;
		    try {
		      Reader reader = new FileReader("client_secrets.json");
		      clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
		      return clientSecrets;
		    } catch (IOException e) {
		      throw new Error("No client_secrets.json found", e);
		   }
		   
		  
	  } 
	  
	  /*
	   * Returns the CLIENT_ID string from the previously generated client secret object
	   */
	  public final static String getClientID(){
		  String CLIENT_ID = ((GoogleClientSecrets) getGCredentials()).getWeb().getClientId();
		  return CLIENT_ID;
	  }
	  
	  /*
	   * Returns CLIENT_SECRET string from client secret object
	   */
	  public final static String getClientSecret(){

		  String CLIENT_SECRET = ((GoogleClientSecrets) getGCredentials()).getWeb().getClientSecret();
		  return CLIENT_SECRET;
	  }
	  
}