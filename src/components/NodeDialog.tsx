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
import { ExternalLink, Book, Video, FileText, Loader2 } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {conceptDetails?.label || 'Loading...'}
          </DialogTitle>
          <DialogDescription>
            Explore this concept in detail
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading concept details...</span>
          </div>
        ) : conceptDetails ? (
          <div className="space-y-6">
            {/* Definition */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Definition</h3>
              <p className="text-gray-700 leading-relaxed">
                {conceptDetails.definition}
              </p>
            </div>

            {/* Examples */}
            {conceptDetails.examples && conceptDetails.examples.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Examples & Use Cases</h3>
                <ul className="space-y-2">
                  {conceptDetails.examples.map((example, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {conceptDetails.resources && conceptDetails.resources.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Learning Resources</h3>
                <div className="space-y-3">
                  {conceptDetails.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-blue-500">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                        >
                          <span>{resource.title}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {resource.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No additional content message */}
            {(!conceptDetails.examples || conceptDetails.examples.length === 0) &&
              (!conceptDetails.resources || conceptDetails.resources.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <p>No additional examples or resources available at this time.</p>
                </div>
              )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load concept details. Please try again.</p>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            {onExpand && (
              <Button variant="outline" onClick={onExpand}>
                Expand Node
              </Button>
            )}
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}