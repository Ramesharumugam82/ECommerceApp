from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser   
from rest_framework.response import Response
from rest_framework import status
from base.models import Product
from base.serializers import UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate 


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser (request):
    """Register a new user."""
    data = request.data

    # Check for required fields
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return Response({"detail": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user already exists
    if User.objects.filter(email=data['email']).exists():
        return Response({"detail": "User  with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create(
        first_name=data['name'],
        username=data['email'],  # You might want to use a separate username field
        email=data['email'],
        password=make_password(data['password'])  # Hash the password
    )
    
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAdminUser ])  # Only admin users can access this
def getUsers(request):
    """Retrieve all users."""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access their profile
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access their profile
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data=request.data
    user.first_name=data['name']
    user.username=data['email']
    user.email=data['email']
    if data['password'] !='':
        user.password=make_password(data['password'])
    
    user.save()
    return Response(serializer.data)

@api_view(['POST'])
def loginUser (request):
    """Login a user and return JWT tokens."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_200_OK)
    return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)