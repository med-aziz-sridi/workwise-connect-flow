
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { searchUsers } from '@/services/userSearch';
import { UserSearchResult } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { getOrCreateConversation } from '@/services/messaging';
import { useToast } from '@/components/ui/use-toast';

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        const searchResults = await searchUsers(query);
        setResults(searchResults.filter(r => r.id !== user?.id)); // Don't show current user
        setIsSearching(false);
        setIsDropdownOpen(true);
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, user?.id]);

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
    setIsDropdownOpen(false);
    setQuery('');
  };

  const handleStartChat = async (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive"
      });
      return;
    }

    try {
      const conversationId = await getOrCreateConversation(user.id, userId);
      if (conversationId) {
        navigate(`/conversation/${conversationId}`);
        setIsDropdownOpen(false);
        setQuery('');
      } else {
        toast({
          title: "Error",
          description: "Could not create conversation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative w-full md:max-w-md" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search users by name or skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsDropdownOpen(true)}
          className="pl-10 pr-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsDropdownOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={result.profilePicture} alt={result.name} />
                        <AvatarFallback>{getInitials(result.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{result.name}</h4>
                          {result.verified && <VerificationBadge className="ml-1" />}
                        </div>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="capitalize mr-2 text-xs">
                            {result.role}
                          </Badge>
                          {result.rating !== undefined && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {result.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewProfile(result.id)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleStartChat(result.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                  {result.skills && result.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {result.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{result.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <div className="p-4 text-center text-gray-500">Type at least 2 characters to search</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
