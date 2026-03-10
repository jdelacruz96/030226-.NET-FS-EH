# This Dockerfile is for my ASP.NET backend API
# So it's going to have an entirely different set 
# of instructions and dependencies
# You need SOME knowledge of the underlying deployment requirements
# for the type of application that you built

# Containers DO NOT COME WITH A DOTNET SDK
# So we need to grab one
# Thankfully Microsoft hosts them for us 
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

# Next, we copy the .csproj
COPY *.csproj ./

# Run dotnet restore
RUN dotnet restore

# Copy source code and run dotnet publish
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Running it with the ASP.NET Core runtime image
# no SDK, no build tools 
# All we take from Stage 1 is the published output inside /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine

WORKDIR /app 

# Copy the published application (all those DLLs and everything)
# From the build stage over to our current container File System
COPY --from=build /app/publish .

EXPOSE 8080

# Start the application
ENTRYPOINT [ "dotnet", "TaskManagerAPI.dll" ]