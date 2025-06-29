'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConceptDetails } from '@/lib/api';
import { ExternalLink, Book, Video, FileText, Loader2, Sparkles, ArrowUpRight } from 'lucide-react';

interface NodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conceptDetails: ConceptDetails | null;
  isLoading: boolean;
  onExpand?: () => void;
}

export function NodeDialog({
  isOpen,
  onClose,
  conceptDetails,
  isLoading,
  onExpand,
}: NodeDialogProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'documentation':
        return <FileText className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'from-red-500 to-pink-500';
      case 'documentation':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 border-gray-200/50">
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 border-b border-gray-200/50">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {conceptDetails?.label || 'Loading...'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Explore this concept in detail and discover related resources
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200" />
                <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
              </div>
              <span className="text-gray-600 font-medium">Loading concept details...</span>
            </div>
          ) : conceptDetails ? (
            <div className="space-y-6">
              {/* Definition */}
              <div className="glass rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                  Definition
                </h3>
                <p className="text-gray-700 leading-relaxed pl-4">
                  {conceptDetails.definition}
                </p>
              </div>

              {/* Examples */}
              {conceptDetails.examples && conceptDetails.examples.length > 0 && (
                <div className="glass rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                    Examples & Use Cases
                  </h3>
                  <ul className="space-y-3 pl-4">
                    {conceptDetails.examples.map((example, index) => (
                      <li key={index} className="flex items-start space-x-3 group">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          <span className="text-xs font-semibold text-green-700">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {conceptDetails.resources && conceptDetails.resources.length > 0 && (
                <div className="glass rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                    Learning Resources
                  </h3>
                  <div className="space-y-3 pl-4">
                    {conceptDetails.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all-smooth group"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getResourceColor(resource.type)} text-white shadow-md group-hover:shadow-lg transition-all`}>
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                            {resource.title}
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 capitalize">
                            {resource.type}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No additional content message */}
              {(!conceptDetails.examples || conceptDetails.examples.length === 0) &&
                (!conceptDetails.resources || conceptDetails.resources.length === 0) && (
                  <div className="text-center py-8 glass rounded-xl">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No additional examples or resources available at this time.</p>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-gray-600">Failed to load concept details. Please try again.</p>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50/50 border-t border-gray-200/50 p-6">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              {onExpand && (
                <Button 
                  variant="outline" 
                  onClick={onExpand}
                  className="hover:bg-purple-50 hover:border-purple-300 transition-all-smooth"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Expand Node
                </Button>
              )}
            </div>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}